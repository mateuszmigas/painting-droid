import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { areRectanglesEqual } from "@/utils/common";
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
      await context.canvasActionDispatcher.execute(
        "applyOverlayShape",
        undefined
      );
    } else {
      shape &&
        (await context.canvasActionDispatcher.execute(
          "clearOverlayShape",
          undefined
        ));
    }
  }
};
