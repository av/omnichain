import { makeNode } from "./_Base";

import type { ChatMessage } from "../../data/types";

const doc = [
    "Reads the current user message's text content from the session.",
    "The message must first be saved to the session using",
    "the AwaitNextMessage node. Consecutive use of this node",
    "will return text from the same message until a new one is saved.",
]
    .join(" ")
    .trim();

export const ReadCurrentMessageTextNode = makeNode(
    {
        nodeName: "ReadCurrentMessageTextNode",
        nodeIcon: "CommentOutlined",
        dimensions: [330, 100],
        doc,
    },
    {
        inputs: [],
        outputs: [{ name: "content", type: "string", label: "text" }],
        controls: [],
    },
    {
        async dataFlow(_nodeId, context) {
            const msg: ChatMessage | null = await context.extraAction({
                type: "readCurrentMessage",
            });
            return {
                content: msg?.content || "",
            };
        },
    }
);
