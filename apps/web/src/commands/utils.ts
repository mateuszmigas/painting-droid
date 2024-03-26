import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { areRectanglesEqual } from "@/utils/common";
import {
  putRectangleCompressedToContext,
  createCompressedFromContext,
} from "@/utils/imageData";
import type { CommandContext } from "./context";

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
      await putRectangleCompressedToContext(
        activeContext!,
        shape.captured!.data,
        shape.boundingBox
      );
      context.canvasActionDispatcher.execute("applyOverlayShape", {
        activeLayerData: createCompressedFromContext(activeContext!),
      });
    } else {
      shape &&
        context.canvasActionDispatcher.execute("clearOverlayShape", undefined);
    }
  }
};

