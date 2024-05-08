import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import type { CommandContext } from "./context";
import { areRectanglesEqual } from "@/utils/geometry";

export const clearOrApplyCapturedArea = async (context: CommandContext) => {
  const shape = activeWorkspaceCanvasDataSelector(
    context.stores.workspaces()
  ).capturedArea;

  if (shape) {
    const apply =
      shape?.captured &&
      !areRectanglesEqual(shape.boundingBox, shape.captured.box);

    if (apply) {
      await context.canvasActionDispatcher.execute(
        "applyCapturedArea",
        undefined
      );
    } else {
      shape &&
        (await context.canvasActionDispatcher.execute(
          "clearCapturedArea",
          undefined
        ));
    }
  }
};

