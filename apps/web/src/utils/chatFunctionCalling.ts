type ChatFunctionParam = {
  type: "number" | "string";
};

type ChatFunctionDefinition = {
  name: string;
  description: string;
  params: Record<string, ChatFunctionParam>;
};

type ChatFunctionResponse = {
  id: string;
  params: Record<string, unknown>;
};

type ChatToolsSchema = Record<string, ChatFunctionDefinition>;

export const createToolsSchemaFromCommands = (): ChatToolsSchema => {
  const schema: ChatToolsSchema = {
    applyGrayscale: {
      name: "Apply Grayscale",
      description: "Converts the image to grayscale",
      params: { amount: { type: "number" } },
    },
    applySepia: {
      name: "Apply Sepia",
      description: "Applies a sepia effect to the image",
      params: { amount: { type: "number" } },
    },
    removeBackground: {
      name: "Remove Background",
      description: "Removes the background from the image",
      params: {},
    },
  };
  return schema;
};

export const serializeToolsSchema = (schema: ChatToolsSchema): string => {
  return JSON.stringify(schema, null, 2);
};

export const parseToolsResponse = (
  _response: string
): ChatFunctionResponse[] => {
  //   return JSON.parse(schema);

  return [];
};

export const response: ChatFunctionResponse[] = [
  {
    id: "applyGrayscale",
    params: { amount: 0.5 },
  },
  {
    id: "applySepia",
    params: { amount: 0.3 },
  },
  {
    id: "removeBackground",
    params: {},
  },
];

export const applyChatFunction = async (_func: ChatFunctionResponse) => {};

const toolsSchema = createToolsSchemaFromCommands();
const serializedSchema = serializeToolsSchema(toolsSchema);
export const parsedResponse = parseToolsResponse(serializedSchema);
// const

