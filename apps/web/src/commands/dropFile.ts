import type { FileInfo } from "@/utils/file";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { ImageProcessor } from "@/utils/imageProcessor";
import { uuid } from "@/utils/uuid";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";

export const command = createCommand({
  id: "dropFile",
  config: { showInPalette: false },
  execute: async (
    context: CommandContext,
    payload: {
      file: FileInfo;
      operation:
        | "create-new-workspace"
        | "add-new-layer"
        | "paste-onto-active-layer";
    }
  ) => {
    const { file, operation } = payload;
    const imageProcessor = ImageProcessor.fromFile(file.blob);
    const canvasData = activeWorkspaceCanvasDataSelector(
      context.stores.workspaces()
    );

    if (operation === "paste-onto-active-layer") {
      const { width, height, data } = await imageProcessor.toCompressed();

      await context.canvasActionDispatcher.execute("addShape", {
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
      const { width, height, data } = await imageProcessor.toCompressed();

      await context.stores
        .workspaces()
        .createWorkspaceFromImage(file.fileName, { width, height }, data);

      return;
    }

    if (operation === "add-new-layer") {
      const data = await imageProcessor
        .resize(canvasData.size)
        .toCompressedData();

      await context.canvasActionDispatcher.execute("addLayer", {
        id: uuid(),
        name: file.fileName,
        data,
      });
    }
  },
});
