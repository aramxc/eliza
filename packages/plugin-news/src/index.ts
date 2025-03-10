import type { Plugin } from "@elizaos/core";

import { factEvaluator } from "./evaluators/fact.ts";

import { boredomProvider } from "./providers/boredom.ts";
import { currentNewsAction } from "./actions/currentNews.ts";
import { randomEmotionProvider } from "./providers/emotionProvider.ts";

export * as actions from "./actions/index.ts";

export const newsPlugin: Plugin = {
    name: "news",
    description: "Gets the current news",
    actions: [
        currentNewsAction,
    ],
    evaluators: [factEvaluator],
    providers: [boredomProvider, randomEmotionProvider],
};
export default newsPlugin;
