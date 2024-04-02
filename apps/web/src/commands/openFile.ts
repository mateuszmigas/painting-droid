import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { supportedImageFormats, workspace } from "@/contants";
import { getTranslations } from "@/translations";
import { splitNameAndExtension } from "@/utils/path";
import { fileSystem } from "@/utils/file-system";
import { ImageProcessor } from "@/utils/imageProcessor";
import { decodePwd } from "@/utils/pdwFormat";

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
          const { size, data } = await decodePwd(text);
          context.stores
            .workspaces()
            .createWorkspaceFromCanvasData(fileName, size, data);
        } else {
          const dataUrl = await fileSystem.readFileAsDataURL(result.path);
          const data = await ImageProcessor.fromDataUrl(dataUrl).toCompressed();
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
