import { makeNode } from "./_Base";

const doc = [
    //
    "Allows teleporting a file array value to the corresponding",
    "portal node. Very handy for dataflow reuse.",
    "The portal ID must match the ID of the",
    "target portal node. Make sure you don't create PortalIn nodes",
    "with the same portal ID in the same graph, because only the",
    "first one will be found by the target.",
]
    .join(" ")
    .trim();

export const PortalInForFileArrayNode = makeNode(
    {
        nodeName: "PortalInForFileArrayNode",
        nodeIcon: "LinkOutlined",
        dimensions: [450, 150],
        doc,
    },
    {
        inputs: [
            //
            {
                name: "source",
                type: "fileArray",
                label: "input (array)",
            },
        ],
        outputs: [],
        controls: [
            {
                name: "portal",
                control: {
                    type: "text",
                    defaultValue: "FileArrayPortal",
                    config: {
                        label: "Portal ID",
                    },
                },
            },
        ],
    }
);
