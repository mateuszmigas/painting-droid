import {
  activeShapeSelector,
  activeWorkspaceCanvasDataSelector,
} from "@/store/workspacesStore";
import type { CommandContext } from "./context";
import { areRectanglesEqual } from "@/utils/geometry";

export const clearOrApplyCapturedArea = async (context: CommandContext) => {
  const canvasData = activeWorkspaceCanvasDataSelector(
    context.stores.workspaces()
  );
  const activeShape = activeShapeSelector(canvasData);

  if (activeShape) {
    const apply =
      activeShape?.capturedArea &&
      !areRectanglesEqual(
        activeShape.boundingBox,
        activeShape.capturedArea.box
      );

    if (apply) {
      await context.canvasActionDispatcher.execute(
        "applyActiveShape",
        undefined
      );
    } else {
      activeShape &&
        (await context.canvasActionDispatcher.execute(
          "clearActiveShape",
          undefined
        ));
    }
  }
};
