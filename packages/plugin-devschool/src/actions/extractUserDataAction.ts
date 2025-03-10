import { 
    Action, 
    IAgentRuntime, 
    Memory, 
    State, 
    HandlerCallback, 
    generateText, 
    ModelClass
} from "@elizaos/core";
import { UserData } from "../types/userData";

export const extractUserDataAction: Action = {
    name: "EXTRACT_USER_DATA",
    similes: ["GET_USER_DATA", "COLLECT_USER_INFO"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Check if we have missing user data
        const cacheKey = `${runtime.agentId}/${message.userId}/data`;
        const cachedData = await runtime.cacheManager.get(cacheKey) as UserData | undefined;

        const requiredFields = ["name", "location", "occupation"];
        const missingFields = requiredFields.filter(field => !(cachedData && cachedData[field]));

        return missingFields.length > 0;
    },
    description: "Extract missing user data in a natural conversation flow",
    handler: async (
        runtime: IAgentRuntime, 
        message: Memory, 
        state: State, 
        options: Record<string, unknown>, 
        callback: HandlerCallback
    ): Promise<boolean> => {
        // Get the missing fields
        const cacheKey = `${runtime.agentId}/${message.userId}/data`;
        const cachedData = await runtime.cacheManager.get(cacheKey) as UserData | undefined;

        console.log("Extract User Data Action - Cache check:", { 
            userId: message.userId, 
            cacheKey, 
            cachedData 
        });
        
        const requiredFields = ["name", "location", "occupation"];
        const missingFields = requiredFields.filter(field => !(cachedData && cachedData[field]));
        
        // Generate a response that naturally asks for the missing information
        const promptContext = `
        You need to ask the user for some missing information in a conversational, natural way.
        Missing information: ${missingFields.join(", ")}
        
        User's last message: "${message.content?.text}"
        
        ${cachedData ? `Information I already have: ${JSON.stringify(cachedData, null, 2)}` : "I don't have any information yet."}
        
        Write a friendly response that naturally asks for the missing information. Be conversational and don't make it sound like a form. Try to only ask for one piece of information at a time. Don't explicitly mention that you're collecting data.
        `;
        
        const responseText = await generateText({
            runtime,
            context: promptContext,
            modelClass: ModelClass.SMALL,
        });
        
        callback({
            text: responseText,
            action: "EXTRACT_USER_DATA"
        });
        
        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Hi there!" },
            },
            {
                user: "{{user2}}",
                content: { 
                    text: "Hello! It's nice to meet you. I'm curious, what's your name?", 
                    action: "EXTRACT_USER_DATA" 
                },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "My name is John." },
            },
            {
                user: "{{user2}}",
                content: { 
                    text: "Great to meet you, John! Where are you from?", 
                    action: "EXTRACT_USER_DATA" 
                },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "I'm from Seattle." },
            },
            {
                user: "{{user2}}",
                content: { 
                    text: "Seattle is a beautiful city! What do you do for work, if you don't mind me asking?", 
                    action: "EXTRACT_USER_DATA" 
                },
            }
        ]
    ],
};