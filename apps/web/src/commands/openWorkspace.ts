import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { workspace } from "@/contants";
import type { Size } from "@/utils/common";
import type { CanvasState } from "@/canvas/canvasState";
import { openAndReadFileAsText } from "@/utils/fileSystem";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const command = createCommand({
  id: "openWorkspace",
  display: translations.commands.openWorkspace,
  icon: "folder-open",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    openAndReadFileAsText({ extension: workspace.format }).then((result) => {
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
