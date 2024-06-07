import { makeNode } from "./_Base";

const doc = [
    "Generate embeddings for a vector DB using OpenAI's API (/v1/completions).",
    "This node can be used with a custom backend by setting the",
    "base url property. Leaving the base url property",
    "empty will default to the official OpenAI API.",
    "The API key name property is used to reference an API key set via",
    "the API key management dialog from the top bar.",
    "The node can be used to generate embeddings for a single text or an array of texts.",
    "If both inputs are provided, the single text input will be appended to the array of texts.",
    "Results will always be returned as an array of JSON-encoded strings which contain",
    "the embeddings (number arrays) for the input text(s).",
]
    .join(" ")
    .trim();

export const OpenAIEmbeddingsNode = makeNode(
    {
        nodeName: "OpenAIEmbeddingsNode",
        nodeIcon: "OpenAIOutlined",
        dimensions: [620, 430],
        doc,
    },
    {
        inputs: [
            //
            { name: "textSingle", type: "string", label: "text (single)" },
            { name: "textArray", type: "stringArray", label: "texts (array)" },
        ],
        outputs: [
            //
            { name: "results", type: "stringArray" },
        ],
        controls: [
            {
                name: "model",
                control: {
                    type: "text",
                    defaultValue: "text-embedding-ada-002",
                    config: {
                        label: "model",
                    },
                },
            },
            {
                name: "format",
                control: {
                    type: "select",
                    defaultValue: "float",
                    config: {
                        label: "encoding_format",
                        values: [
                            {
                                label: "float",
                                value: "float",
                            },
                            {
                                label: "base64",
                                value: "base64",
                            },
                        ],
                    },
                },
            },
            {
                name: "dimensions",
                control: {
                    type: "number",
                    defaultValue: null,
                    config: {
                        label: "dimensions",
                    },
                },
            },
            {
                name: "apiKeyName",
                control: {
                    type: "text",
                    defaultValue: "",
                    config: {
                        label: "API key name",
                    },
                },
            },
            {
                name: "baseUrl",
                control: {
                    type: "text",
                    defaultValue: "https://api.openai.com",
                    config: {
                        label: "base_url",
                    },
                },
            },
        ],
    },
    {
        async dataFlow(nodeId, context) {
            const inputs = await context.fetchInputs(nodeId);
            const controls = context.getAllControls(nodeId);

            const textsToEmbed = (inputs.textArray || [])[0] || [];
            const textSingle = (inputs.textSingle || [])[0];

            if (textSingle) {
                textsToEmbed.push(textSingle);
            }

            if (!textsToEmbed?.length) {
                throw new Error("No text to embed!");
            }

            const apiKeyName = ((controls.apiKeyName as string) || "").trim();

            const apiKey = context.getApiKeyByName(apiKeyName) || "empty";

            const baseUrl = (
                (controls.baseUrl as string) || "https://api.openai.com"
            ).trim();

            const model = ((controls.model as string) || "").trim();

            const response = await fetch(`${baseUrl}/v1/embeddings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    input: textsToEmbed,
                    encoding_format: controls.format,
                    dimensions: controls.dimensions,
                }),
            });

            const embeddingsData = await response.json();

            return {
                results: embeddingsData.data.map((embObj: any) =>
                    JSON.stringify(embObj.embedding)
                ),
            };
        },
    }
);
