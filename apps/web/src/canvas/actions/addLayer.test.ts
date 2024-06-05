import { describe, expect, test } from "vitest";
import { createCanvasAction } from "./addLayer";
import { createDefaultCanvasState } from "../canvasState";
import type { CanvasActionContext } from "./context";

const state = createDefaultCanvasState({
  width: 100,
  height: 100,
});

describe("add layer", () => {
  const context: CanvasActionContext = { getState: () => state };
  const data = new Blob([], { type: "image/png" });

  test("should add new default layer and set provided data", async () => {
    const action = await createCanvasAction(context, { id: "1", data });
    const newState = await action.execute(state);
    expect(newState.layers[newState.layers.length - 1]).toStrictEqual({
      id: "1",
      name: "Layer 2",
      data,
      locked: false,
      visible: true,
    });
  });

  test("should set added layer as active", async () => {
    const action = await createCanvasAction(context, { id: "2", data });
    const newState = await action.execute(state);
    expect(newState.activeLayerIndex).toBe(state.layers.length);
  });

  test("should undo adding layer", async () => {
    const action = await createCanvasAction(context, { id: "3", data });
    const newState = await action.execute(state);
    const undoState = await action.undo(newState);
    expect(undoState).toStrictEqual(state);
  });
});

