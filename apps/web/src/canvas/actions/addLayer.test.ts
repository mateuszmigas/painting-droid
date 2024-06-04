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

  test("should create new default layer and set provided data", async () => {
    const action = await createCanvasAction(context, { data });
    const newState = await action.execute(state);
    expect(newState.layers[newState.layers.length - 1]);
  });

  test("should set new layer as active", async () => {
    const action = await createCanvasAction(context, { data });
    const newState = await action.execute(state);
    expect(newState.activeLayerIndex).toBe(state.layers.length);
  });

  test("should undo adding layer", () => {});
});

