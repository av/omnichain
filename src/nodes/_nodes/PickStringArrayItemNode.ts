import { makeNode } from "./_Base";

export const PickStringArrayItemNode = makeNode(
    {
        nodeName: "PickStringArrayItemNode",
        nodeIcon: "OrderedListOutlined",
        dimensions: [300, 175],
        doc: "Pick an item from a string array by index.",
    },
    {
        inputs: [{ name: "array", type: "stringArray", label: "array" }],
        outputs: [{ name: "string", type: "string", label: "string" }],
        controls: [
            {
                name: "index",
                control: {
                    type: "number",
                    defaultValue: 0,
                    config: {
                        label: "index",
                        min: 0,
                    },
                },
            },
        ],
    },
    {
        dataFlow: {
            inputs: ["array"],
            outputs: ["string"],
            async logic(_node, _context, controls, fetchInputs) {
                const inputs = await fetchInputs();
                const array = (inputs["array"] ?? [])[0] ?? [];
                return {
                    string: array[controls.index] || "",
                };
            },
        },
    }
);
