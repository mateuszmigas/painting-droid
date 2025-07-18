import { command as addLayer } from "./addLayer";
import { command as checkForUpdate } from "./checkForUpdate";
import { command as clearActiveWorkspace } from "./clearActiveWorkspace";
import { command as closeActiveWorkspace } from "./closeActiveWorkspace";
import { command as copyImage } from "./copyImage";
import { command as createActiveWorkspace } from "./createActiveWorkspace";
import { command as cutImage } from "./cutImage";
import { command as dropFile } from "./dropFile";
import { command as duplicateLayer } from "./duplicateLayer";
import { command as editWorkspace } from "./editWorkspace";
import { command as fitCanvasToWindow } from "./fitCanvasToWindow";
import { command as hideLayer } from "./hideLayer";
import { command as mergeLayerDown } from "./mergeLayerDown";
import { command as moveLayerDown } from "./moveLayerDown";
import { command as moveLayerUp } from "./moveLayerUp";
import { command as openAdjustmentsPopup } from "./openAdjustmentsPopup";
import { command as openChatPopup } from "./openChatPopup";
import { command as openCommandPalette } from "./openCommandPalette";
import { command as openCropCanvasDialog } from "./openCropCanvasDialog";
import { command as openFile } from "./openFile";
import { command as openImageToImageDialog } from "./openImageToImageDialog";
import { command as openLabelObjectsDialog } from "./openLabelObjectsDialog";
import { command as openRemoveBackgroundDialog } from "./openRemoveBackgroundDialog";
import { command as openResizeCanvasDialog } from "./openResizeCanvasDialog";
import { command as openSettingsDialog } from "./openSettingsDialog";
import { command as openSmartCropDialog } from "./openSmartCropDialog";
import { command as openTextToImageDialog } from "./openTextToImageDialog";
import { command as pasteImage } from "./pasteImage";
import { command as redoCanvasAction } from "./redoCanvasAction";
import { command as removeLayer } from "./removeLayer";
import { command as resetLayout } from "./resetLayout";
import { command as saveAsJpeg } from "./saveAsJpeg";
import { command as saveAsPng } from "./saveAsPng";
import { command as saveAsWorkspace } from "./saveAsWorkspace";
import { command as selectTool } from "./selectTool";
import { command as shareWorkspace } from "./shareWorkspace";
import { command as showLayer } from "./showLayer";
import { command as undoCanvasAction } from "./undoCanvasAction";

export const commands = {
  saveAsPng,
  saveAsJpeg,
  saveAsWorkspace,
  openFile,
  createActiveWorkspace,
  openCommandPalette,
  resetLayout,
  closeActiveWorkspace,
  fitCanvasToWindow,
  undoCanvasAction,
  redoCanvasAction,
  clearActiveWorkspace,
  selectTool,
  openAdjustmentsPopup,
  addLayer,
  removeLayer,
  moveLayerUp,
  moveLayerDown,
  duplicateLayer,
  hideLayer,
  showLayer,
  openLabelObjectsDialog,
  openTextToImageDialog,
  copyImage,
  pasteImage,
  cutImage,
  checkForUpdate,
  openCropCanvasDialog,
  openResizeCanvasDialog,
  openSettingsDialog,
  mergeLayerDown,
  openSmartCropDialog,
  shareWorkspace,
  openImageToImageDialog,
  dropFile,
  editWorkspace,
  openRemoveBackgroundDialog,
  openChatPopup,
} as const;

export type CommandId = keyof typeof commands;
export type Command = (typeof commands)[keyof typeof commands];

type MapToExecuteCommand<U> = U extends Command
  ? Parameters<U["execute"]>[1] extends undefined
    ? [id: U["id"]]
    : [id: U["id"], params: Parameters<U["execute"]>[1]]
  : never;

export type ExecuteCommand = (...[id, params]: MapToExecuteCommand<Command>) => Promise<void>;

export type ExecuteCommandWithDefaults = (id: CommandId) => Promise<void>;
