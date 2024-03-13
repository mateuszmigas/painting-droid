import { downloadAsFile } from "@/utils/html";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import {
  compressedDataToDataUrl,
  mergeCompressedData,
} from "@/utils/imageData";

export const command = createCommand({
  id: "saveCurrentWorkspaceAsFile",
  name: "Save Current Workspace As File",
  icon: "save",
  options: { showInPalette: true },
  execute: async (
    context: CommandContext,
    payload: {
      format: "jpeg" | "png";
    } = { format: "jpeg" }
  ) => {
    const { format } = payload;

    const canvasData = activeWorkspaceCanvasDataSelector(
      context.stores.workspaces()
    );
    const layersData = canvasData.layers
      .filter((layer) => layer.compressedData)
      .map((layer) => layer.compressedData!);

    const mergedData = await mergeCompressedData(layersData);
    const data = await compressedDataToDataUrl(mergedData, format);
    downloadAsFile(data, `picture.${format}`);
  },
});

