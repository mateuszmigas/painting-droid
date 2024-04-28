import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { supportedImageFormats, workspace } from "@/constants";
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
  settings: { showInPalette: true },
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
          const { data } = await decodePwd(text);
          context.stores
            .workspaces()
            .createWorkspaceFromCanvasData(fileName, data);
        } else {
          const dataUrl = await fileSystem.readFileAsDataURL(result.path);
          const image = await ImageProcessor.fromDataUrl(
            dataUrl
          ).toCompressed();
          context.stores
            .workspaces()
            .createWorkspaceFromImage(
              fileName,
              { width: image.width, height: image.height },
              image.data
            );
        }
      });
  },
});

