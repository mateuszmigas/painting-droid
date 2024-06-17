import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import type { FileInfo } from "@tauri-apps/plugin-fs";

export const command = createCommand({
  id: "dropFiles",
  display: "",
  icon: "plus",
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
