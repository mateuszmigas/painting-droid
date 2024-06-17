import type { FileInfo } from "@/utils/file";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

export const command = createCommand({
  id: "dropFiles",
  config: { showInPalette: false },
  execute: async (
    _: CommandContext,
    payload: {
      files: FileInfo[];
      operation:
        | "create-new-workspace"
        | "add-new-layer"
        | "paste-onto-active-layer";
    }
  ) => {
    console.log(payload);
  },
});

