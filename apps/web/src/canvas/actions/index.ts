import { createCanvasAction as addLayer } from "./addLayer";
import { createCanvasAction as addShape } from "./addShape";
import { createCanvasAction as applyActiveShape } from "./applyActiveShape";
import { createCanvasAction as clearActiveShape } from "./clearActiveShape";
import { createCanvasAction as cropCanvas } from "./cropCanvas";
import { createCanvasAction as cutCapturedArea } from "./cutCapturedArea";
import { createCanvasAction as duplicateLayer } from "./duplicateLayer";
import { createCanvasAction as hideLayer } from "./hideLayer";
import { createCanvasAction as mergeLayerDown } from "./mergeLayerDown";
import { createCanvasAction as moveLayerDown } from "./moveLayerDown";
import { createCanvasAction as moveLayerUp } from "./moveLayerUp";
import { createCanvasAction as removeLayer } from "./removeLayer";
import { createCanvasAction as resizeCanvas } from "./resizeCanvas";
import { createCanvasAction as resolveActiveShape } from "./resolveActiveShape";
import { createCanvasAction as selectLayer } from "./selectLayer";
import { createCanvasAction as showLayer } from "./showLayer";
import { createCanvasAction as transformShape } from "./transformShape";
import { createCanvasAction as updateLayerData } from "./updateLayerData";

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
  addShape,
  transformShape,
  clearActiveShape,
  applyActiveShape,
  resolveActiveShape,
  cutCapturedArea,
  cropCanvas,
  resizeCanvas,
  mergeLayerDown,
};
