import { describe, expect, test } from "vitest";
import { createCanvasAction } from "./addShape";
import { createDefaultCanvasState } from "../canvasState";
import type { CanvasActionContext } from "./context";

const state = createDefaultCanvasState({
  width: 100,
  height: 100,
});

describe("add shape", () => {
  const context: CanvasActionContext = { getState: () => state };
  const shape = {
    id: "1",
    type: "drawn-rectangle",
    boundingBox: { x: 0, y: 0, width: 10, height: 10 },
    fill: { r: 0, g: 0, b: 0, a: 1 },
    stroke: { color: { r: 0, g: 0, b: 0, a: 1 }, width: 1 },
  } as const;

  test("should add provided shape", async () => {
    const action = await createCanvasAction(context, { shape });
    const newState = await action.execute(state);
    expect(newState.shapes["1"]).toStrictEqual(shape);
  });

  test("should set added shape as active", async () => {
    const action = await createCanvasAction(context, { shape });
    const newState = await action.execute(state);
    expect(newState.activeShapeId).toBe("1");
  });

  test("should undo adding shape", async () => {
    const action = await createCanvasAction(context, { shape });
    const newState = await action.execute(state);
    const undoState = await action.undo(newState);
    expect(undoState).toStrictEqual(state);
  });
});

