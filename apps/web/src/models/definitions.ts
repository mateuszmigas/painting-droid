import { model as demo } from "./demo";
import { model as stabilityAi } from "./stabilityAi";
import { model as facebookDetrResnet50 } from "./facebook_detr-resnet-50";
import { model as openAiDalle2 } from "./openAiDalle2";
import { model as openAiDalle3 } from "./openAiDalle3";
import { model as stableDiffusionServer } from "./stableDiffusionServer";
import { model as briaaiRMBG14 } from "./briaai_RMBG-1.4";
import { model as ollamaLlava } from "./ollamaLlava";

export const modelDefinitions = [
  stabilityAi,
  openAiDalle2,
  openAiDalle3,
  demo,
  facebookDetrResnet50,
  stableDiffusionServer,
  briaaiRMBG14,
  ollamaLlava,
] as const;
export type ModelType = (typeof modelDefinitions)[number]["type"];

export const isTextToImageModel = (model: { type: string }) =>
  "textToImage" in model;

export const isImageToImageModel = (model: { type: string }) =>
  "imageToImage" in model;

export const isObjectDetectionModel = (model: { type: string }) =>
  "detectObjects" in model;

export const isRemoveBackgroundModel = (model: { type: string }) =>
  "removeBackground" in model;

export const isChatModel = (model: { type: string }) => "chat" in model;

export const textToImageModelTypes = modelDefinitions
  .filter(isTextToImageModel)
  .map((model) => model.type);

export const imageToImageModelTypes = modelDefinitions
  .filter(isImageToImageModel)
  .map((model) => model.type);

export const objectDetectionModelTypes = modelDefinitions
  .filter(isObjectDetectionModel)
  .map((model) => model.type);

export const removeBackgroundModelTypes = modelDefinitions
  .filter(isRemoveBackgroundModel)
  .map((model) => model.type);

export const chatModelTypes = modelDefinitions
  .filter(isChatModel)
  .map((model) => model.type);

