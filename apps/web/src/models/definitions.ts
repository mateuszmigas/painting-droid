import { model as demo } from "./demo";
import { model as stabilityAi } from "./stabilityAi";
import { model as facebookDetrResnet50 } from "./facebook_detr-resnet-50";

export const modelDefinitions = [
  stabilityAi,
  demo,
  facebookDetrResnet50,
] as const;
export type ModelType = (typeof modelDefinitions)[number]["type"];

export const isTextToImageModel = (model: { type: string }) =>
  "textToImage" in model;

export const isObjectDetectionModel = (model: { type: string }) =>
  "detectObjects" in model;

export const textToImageModelTypes = modelDefinitions
  .filter(isTextToImageModel)
  .map((model) => model.type);

export const objectDetectionModelTypes = modelDefinitions
  .filter(isObjectDetectionModel)
  .map((model) => model.type);
