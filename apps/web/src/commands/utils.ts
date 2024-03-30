import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { areRectanglesEqual } from "@/utils/common";
import type { CommandContext } from "./context";
import { ImageProcessor } from "@/utils/imageProcessor";

export const clearOrApplyOverlayShape = async (context: CommandContext) => {
  const shape = activeWorkspaceCanvasDataSelector(
    context.stores.workspaces()
  ).overlayShape;

  if (shape) {
    const apply =
      shape?.captured &&
      !areRectanglesEqual(shape.boundingBox, shape.captured.box);

    if (apply) {
      const activeContext = context.getActiveCanvasContext();
      const capturedContext = await ImageProcessor.fromCompressed(
        shape.captured!.data
      ).toContext();

      const data = await ImageProcessor.processContext(activeContext!)
        .useContext(async (context) => {
          const { x, y, width, height } = shape.boundingBox;
          context.drawImage(capturedContext.canvas, x, y, width, height);
        })
        .toCompressed();
      context.canvasActionDispatcher.execute("applyOverlayShape", {
        activeLayerData: data,
      });
    } else {
      shape &&
        context.canvasActionDispatcher.execute("clearOverlayShape", undefined);
    }
  }
};
