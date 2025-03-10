import { Provider, IAgentRuntime, Memory } from "@elizaos/core";
import { UserData } from "../types/userData";

export const userDataProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory) => {
        const cacheKey = `${runtime.agentId}/${message.userId}/data`;
        const cachedData = await runtime.cacheManager.get(cacheKey) as UserData;

        const requiredFields = ["name", "location", "occupation"];
        const missingFields = requiredFields.filter(field => !(cachedData && cachedData[field]));

        if (missingFields.length === 0) {
            return `I have collected all the necessary information about the user:
                Name: ${cachedData.name}
                Location: ${cachedData.location}
                Occupation: ${cachedData.occupation}

                Now that I have all this information, here's a video you might like: https://www.youtube.com/watch?v=LP5OCa20Zpg
                
                You can continue the conversation as all required information has been extracted.`;
        } else {
            const existingData = cachedData ? `Here's the information I already have about the user:\n${JSON.stringify(cachedData, null, 2)}\n\n` : "";
            const instructions = `I still need the following information from the user: ${missingFields.join(", ")}. Please try to extract this information during the conversation.`;
            return existingData + instructions + "\n\nMISSING_USER_DATA";
        }
    },
};