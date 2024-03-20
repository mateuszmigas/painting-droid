import { openFile, readFileAsText } from "@/utils/html";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { workspaceFormat } from "@/contants";
import type { Size } from "@/utils/common";
import type { CanvasState } from "@/canvas/canvasState";

export const command = createCommand({
  id: "openWorkspace",
  display: "Open Workspace (PDW)",
  icon: "save",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    openFile({ extension: workspaceFormat }).then((file) => {
      file.name;
      readFileAsText(file).then((text) => {
        const { size, data } = JSON.parse(text!) as {
          version: number;
          size: Size;
          data: CanvasState;
        };

        const nameWithoutExtension = file.name.slice(0, -4);
        context.stores
          .workspaces()
          .loadWorkspace(nameWithoutExtension, size, data);
      });
    });
  },
});
