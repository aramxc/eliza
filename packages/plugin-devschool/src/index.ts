import type { Plugin } from "@elizaos/core";

import { factEvaluator } from "./evaluators/fact.ts";

import { boredomProvider } from "./providers/boredom.ts";
import { currentNewsAction } from "./actions/currentNews.ts";
import { randomEmotionProvider } from "./providers/emotionProvider.ts";
import { userDataProvider } from "./providers/userDataProvider.ts";
import { userDataEvaluator } from "./evaluators/userDataEvaluator.ts";
import { extractUserDataAction } from "./actions/extractUserDataAction.ts";

export * as actions from "./actions/index.ts";

export const devschoolPlugin: Plugin = {
    name: "devschool",
    description: "Gets the current news",
    actions: [
        currentNewsAction,
        extractUserDataAction,
    ],
    evaluators: [factEvaluator, userDataEvaluator],
    providers: [boredomProvider, randomEmotionProvider, userDataProvider],
};
export default devschoolPlugin;
