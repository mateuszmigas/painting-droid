import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { supportedImageFormats, workspace } from "@/contants";
import type { Size } from "@/utils/common";
import type { CanvasState } from "@/canvas/canvasState";
import { getTranslations } from "@/translations";
import { compressedFromImage, loadImageFromData } from "@/utils/imageData";
import { splitNameAndExtension } from "@/utils/path";
import { fileSystem } from "@/utils/file-system";

const translations = getTranslations();

export const command = createCommand({
  id: "openFile",
  display: translations.commands.openFile,
  icon: "folder-open",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    fileSystem
      .openFile({
        extensions: [workspace.format, ...supportedImageFormats],
      })
      .then(async (result) => {
        if (!result) {
          return;
        }
        const { fileName, extension } = splitNameAndExtension(result.name);

        if (extension?.toLocaleLowerCase() === workspace.format) {
          const text = await fileSystem.readFileAsText(result.path);
          const { size, data } = JSON.parse(text) as {
            version: number;
            size: Size;
            data: CanvasState;
          };
          context.stores
            .workspaces()
            .createWorkspaceFromCanvasData(fileName, size, data);
        } else {
          const dataUrl = await fileSystem.readFileAsDataURL(result.path);
          const image = await loadImageFromData(dataUrl as string);
          const data = await compressedFromImage(image);

          context.stores
            .workspaces()
            .createWorkspaceFromImage(
              fileName,
              { width: data.width, height: data.height },
              data
            );
        }
      });
  },
});
