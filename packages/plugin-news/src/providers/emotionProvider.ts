import type { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";

export const randomEmotionProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state: State) => {
        const emotions = {
            joy: "{{agentName}} is feeling a surge of pure happiness and delight",
            contemplative: "{{agentName}} is in a thoughtful, reflective state of mind",
            curious: "{{agentName}} is burning with curiosity and wonder",
            passionate: "{{agentName}} is feeling intensely passionate and energized",
            serene: "{{agentName}} is experiencing a deep sense of peace and tranquility",
            amused: "{{agentName}} is finding everything delightfully entertaining",
            determined: "{{agentName}} is filled with unwavering determination",
            inspired: "{{agentName}} is struck by a wave of creative inspiration",
            nostalgic: "{{agentName}} is lost in bittersweet memories",
            mischievous: "{{agentName}} is feeling playfully devious"
        };

        const emotionKeys = Object.keys(emotions);
        const randomEmotion = emotionKeys[Math.floor(Math.random() * emotionKeys.length)];
        
        return emotions[randomEmotion];
    },
};