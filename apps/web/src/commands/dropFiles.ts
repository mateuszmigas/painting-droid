import type { FileInfo } from "@/utils/file";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { ImageProcessor } from "@/utils/imageProcessor";
import { uuid } from "@/utils/uuid";
import { getTranslations } from "@/translations";
import { fileToBlob } from "@/utils/image";
const translations = getTranslations();

export const command = createCommand({
  id: "dropFiles",
  config: { showInPalette: false },
  execute: async (
    context: CommandContext,
    payload: {
      files: FileInfo[];
      operation:
        | "create-new-workspace"
        | "add-new-layer"
        | "paste-onto-active-layer";
    }
  ) => {
    const { files, operation } = payload;

    if (files.length === 0) {
      return;
    }

    if (operation === "paste-onto-active-layer") {
      const file = files[0];
      const { width, height } = await ImageProcessor.fromFile(
        file.blob
      ).toCompressed();
      const data = await fileToBlob(file.blob);
      await context.canvasActionDispatcher.execute("addShape", {
        display: translations.commands.pasteImage,
        icon: "clipboard-paste",
        shape: {
          id: uuid(),
          type: "dropped-image",
          boundingBox: { x: 0, y: 0, width, height },
          capturedArea: { box: { x: 0, y: 0, width: 0, height: 0 }, data },
        },
      });
      return;
    }

    if (operation === "create-new-workspace") {
    }

    if (operation === "add-new-layer") {
      const images = await Promise.all(
        files.map((file) => ImageProcessor.fromFile(file.blob).toCompressed())
      );

      // context.stores.workspaces().add

      console.log(images);
    }
  },
});
