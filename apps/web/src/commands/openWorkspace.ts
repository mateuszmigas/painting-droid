import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { workspaceFormat } from "@/contants";
import type { Size } from "@/utils/common";
import type { CanvasState } from "@/canvas/canvasState";
import { openAndReadFileAsText } from "@/utils/fileSystem";

export const command = createCommand({
  id: "openWorkspace",
  display: "Open Workspace (PDW)",
  icon: "save",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    openAndReadFileAsText({ extension: workspaceFormat }).then((result) => {
      if (!result) {
        return;
      }
      const { name, text } = result;
      const { size, data } = JSON.parse(text!) as {
        version: number;
        size: Size;
        data: CanvasState;
      };
      const nameWithoutExtension = name.slice(0, -4);
      context.stores
        .workspaces()
        .loadWorkspace(nameWithoutExtension, size, data);
    });
  },
});