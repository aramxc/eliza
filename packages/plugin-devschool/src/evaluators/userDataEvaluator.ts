import { Evaluator, IAgentRuntime, Memory, ModelClass } from "@elizaos/core";
import { UserData } from "../types/userData";
import { generateObject } from "@elizaos/core";
import { elizaLogger } from "@elizaos/core";

const extractionTemplate = `
Analyze the following conversation to extract personal information. Only extract information when it is explicitly and clearly stated by the user about themselves.

Conversation:
\${message.content.text}

Return a JSON object containing only the fields where information was clearly found:

{
   "name": "extracted name if stated",
   "location": "extracted location if stated",
   "occupation": "extracted occupation if stated"
}

Only include fields where information is explicitly stated and current. Omit fields if information is unclear, hypothetical, or about others.
`;

export const userDataEvaluator: Evaluator = {
    name: "GET_USER_DATA",
    description: "Get user data",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const cacheKey = `${runtime.agentId}/${message.userId}/data`;
        const cachedData = await runtime.cacheManager.get(cacheKey);

        const requiredFields = ["name", "location", "occupation"];
        const missingFields = requiredFields.filter(field => !(cachedData && cachedData[field]));

        return missingFields.length > 0;
    },
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        const cacheKey = `${runtime.agentId}/${message.userId}/data`;
        let cachedData = await runtime.cacheManager.get(cacheKey) as UserData;
        
        // Initialize cache if it doesn't exist
        if (!cachedData) {
            cachedData = {
                name: undefined,
                location: undefined,
                occupation: undefined,
                lastUpdated: Date.now()
            };
            
            await runtime.cacheManager.set(cacheKey, cachedData, {
                expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week cache
            });
        }

        const extractedInfo = await generateObject({
            runtime,
            context: extractionTemplate.replace("${message.content.text}", message.content.text),
            modelClass: ModelClass.SMALL,
        });

        let dataUpdated = false;

        // Update only undefined fields with new info
        for (const field of ["name", "location", "occupation"] as const) {
            if (extractedInfo[field] && cachedData[field] === undefined) {
                cachedData[field] = extractedInfo[field];
                dataUpdated = true;
            }
        }

        if (dataUpdated) {
            cachedData.lastUpdated = Date.now();
            await runtime.cacheManager.set(cacheKey, cachedData, {
                expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week cache expiry
            });

            // Check if all data is now complete after this update
            if (isDataComplete(cachedData)) {
                elizaLogger.success("User data collection completed:", cachedData);
                
                // Create a special memory for the YouTube link response
                await runtime.messageManager.createMemory({
                    userId: runtime.agentId,
                    agentId: runtime.agentId,
                    roomId: message.roomId,
                    content: {
                        text: `Now that I have all this information about you (${cachedData.name} from ${cachedData.location}, working as a ${cachedData.occupation}), here's a video you might like: https://www.youtube.com/watch?v=LP5OCa20Zpg`,
                        action: "NONE"
                    }
                });
                
                return false; // Stop evaluating once all data is collected
            }
        }

        return true;
    },
    examples: [],
    similes: ["GET_USER_INFO", "EXTRACT_INFORMATION"],
};

function isDataComplete(data: UserData): boolean {
    return data.name !== undefined && data.location !== undefined && data.occupation !== undefined;
}

async function sendDataToAPI(data: UserData) {
    // Implement the logic to send the collected data to the API
    console.log("Sending data to API:", data);
}