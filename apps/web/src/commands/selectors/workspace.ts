import {
  activeWorkspaceSelector,
  type AppWorkspacesState,
} from "@/store/workspacesStore";
import { ImageProcessor } from "@/utils/imageProcessor";

export const selectLayersAsBlob = async (
  workspace: AppWorkspacesState,
  format: "png" | "jpeg"
) => {
  const { canvasData, name } = activeWorkspaceSelector(workspace);
  const layersData = canvasData.layers
    .filter((layer) => layer.data)
    .map((layer) => layer.data!);

  const blob = await ImageProcessor.fromMergedCompressed(
    layersData,
    canvasData.size
  ).toBlob(format);
  return { blob, name };
};

