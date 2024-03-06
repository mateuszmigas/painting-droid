import { CommandContext } from "./context";

export const command = {
  name: "saveAsCurrentWorkspace",
  description: "Save the current workspace as a new file",
  execute: async (
    context: CommandContext,
    payload: {
      workspaceId: string;
      layerName: string;
    }
  ) => {
    console.log("Saving sheet", context, payload);
  },
} as const;

