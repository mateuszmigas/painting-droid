import { transformerJsClient } from "./providers/local/transformerJsClient";
import { createRemoveBackgroundSection, type RemoveBackgroundModel } from "./types/removeBackgroundModel";

const removeBackground = createRemoveBackgroundSection({
  optionsSchema: {},
  execute: async (_, image) => {
    const data = await transformerJsClient.removeBackground(image);
    return { ...image, data };
  },
});

export const model = {
  type: "briaai/RMBG-1.4",
  defaultName: "Briaai RMBG-1.4",
  predefined: true,
  url: "https://huggingface.co/briaai/RMBG-1.4",
  removeBackground,
} as const satisfies RemoveBackgroundModel;
