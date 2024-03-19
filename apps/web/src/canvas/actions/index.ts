import { createCanvasAction as removeLayer } from "./removeLayer";
import { createCanvasAction as addLayer } from "./addLayer";
import { createCanvasAction as updateLayerData } from "./updateLayerData";
import { createCanvasAction as selectLayer } from "./selectLayer";
import { createCanvasAction as duplicateLayer } from "./duplicateLayer";
import { createCanvasAction as moveLayerUp } from "./moveLayerUp";
import { createCanvasAction as moveLayerDown } from "./moveLayerDown";
import { createCanvasAction as hideLayer } from "./hideLayer";
import { createCanvasAction as showLayer } from "./showLayer";
import { createCanvasAction as drawOverlayShape } from "./drawOverlayShape";
import { createCanvasAction as transformOverlayShape } from "./transformOverlayShape";
import { createCanvasAction as clearOverlayShape } from "./clearOverlayShape";

export const canvasActions = {
  removeLayer,
  addLayer,
  updateLayerData,
  selectLayer,
  duplicateLayer,
  moveLayerUp,
  moveLayerDown,
  hideLayer,
  showLayer,
  drawOverlayShape,
  transformOverlayShape,
  clearOverlayShape,
};
