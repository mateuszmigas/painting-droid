import {
  activeWorkspaceSelector,
  type AppWorkspacesState,
} from "@/store/workspacesStore";
import { ImageProcessor } from "@/utils/imageProcessor";

export const selectWorkspaceAsImage = async (
  workspace: AppWorkspacesState,
  format: "png" | "jpeg"
) => {
  const { canvasData, name } = activeWorkspaceSelector(workspace);

  const blobs: Blob[] = [];
  if (canvasData.baseColor !== null) {
    blobs.push(
      await ImageProcessor.fromColor(
        canvasData.baseColor,
        canvasData.size
      ).toBlob()
    );
  }

  blobs.push(
    ...canvasData.layers
      .filter((layer) => layer.data)
      .map((layer) => layer.data!)
  );

  const blob = await ImageProcessor.fromMergedCompressed(
    blobs,
    canvasData.size
  ).toBlob(format);
  return { blob, name };
};
