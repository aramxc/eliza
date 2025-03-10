import {
    type ActionExample,
    type IAgentRuntime,
    type Memory,
    type Action,
    type State,
    type HandlerCallback,
    type Content,
    composeContext,
    generateText,
    ModelClass,
} from "@elizaos/core";

async function getCurrentNews(searchTerm: string) {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${process.env.NEWS_API_KEY}`);
        const data = await response.json();
        return data.articles.slice(0, 5).map((article) => {
            return `${article.title}\n${article.description}\n${article.url}\n${article.content}`;
        }).join("\n\n");
    } catch (error) {
        console.error('Error fetching news:', error);
        return "Sorry, there was an error fetching the news.";
    }
}

export const currentNewsAction: Action = {
    name: "CURRENT_NEWS",
    similes: ["NEWS", "GET_NEWS", "GET_CURRENT_NEWS"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description:
        "Get the current news for a given search term if asked by the user",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State, 
        // State = current state, could recompose but expensive. If composing, do it at right time and pass around as needed.
        // A state could be getRecentMessages, passes into the action
        _options: Record<string, unknown>,
        _callback: HandlerCallback,
    ): Promise<boolean> => {

        // Extract search term from users message via prompt
        const context = `Extract the search term from the user message: The message is:
        ${_message.content?.text}
        Only respond with the search term, do not include any other text.
        ;`;

        const searchTerm = await generateText({
            runtime: _runtime,
            context,
            modelClass: ModelClass.SMALL,
            stop: ["\n"],
        });

        const currentNews = await getCurrentNews(searchTerm);
        
        _callback({
            text: "Current news for " + searchTerm + " is: " + currentNews,
        });

        // CREATE NEW MEMORY:
         const newMemory: Memory = {
            userId: _message.agentId,
            agentId: _message.agentId,
            roomId: _message.roomId,
            content: {
                text: currentNews,
                action: "CURRENT_NEWS_RESPONSE",
                source: _message.content?.source,
            } as Content,
        };
        
        // STORE IN MEMORY:
        await _runtime.messageManager.createMemory(newMemory);

        _callback(newMemory.content);
      
       
        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "What's the latest news about Bitcoin?" },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "CURRENT_NEWS" },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Can you show me current Bitcoin news?" },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "CURRENT_NEWS" },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Tell me what's happening with Bitcoin" },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "CURRENT_NEWS" },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Get me the latest Bitcoin news" },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "CURRENT_NEWS" },
            }
        ]
    ] as ActionExample[][],
} as Action;