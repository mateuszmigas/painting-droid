import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import { compressedDataToBlob, mergeCompressedData } from "@/utils/imageData";
import { saveBlobToFile } from "@/utils/fileSystem";

export const command = createCommand({
  id: "saveAsPng",
  display: "Save As Image (PNG)",
  icon: "save",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const format = "png";
    const { canvasData, name } = activeWorkspaceSelector(
      context.stores.workspaces()
    );
    const layersData = canvasData.layers
      .filter((layer) => layer.data)
      .map((layer) => layer.data!);

    const mergedData = await mergeCompressedData(layersData);
    const blob = await compressedDataToBlob(mergedData, format);
    saveBlobToFile(blob, name, format);
  },
});
