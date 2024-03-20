import { downloadAsFile } from "@/utils/html";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import {
  compressedDataToDataUrl,
  mergeCompressedData,
} from "@/utils/imageData";

export const command = createCommand({
  id: "saveAsJpeg",
  display: "Save As Image (JPEG)",
  icon: "save",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const format = "jpeg";
    const { canvasData, name } = activeWorkspaceSelector(
      context.stores.workspaces()
    );
    const layersData = canvasData.layers
      .filter((layer) => layer.data)
      .map((layer) => layer.data!);

    const mergedData = await mergeCompressedData(layersData);
    const data = await compressedDataToDataUrl(mergedData, format);
    downloadAsFile(data, `${name}.${format}`);
  },
});
