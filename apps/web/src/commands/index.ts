import { command as saveAsPng } from "./saveAsPng";
import { command as saveAsJpeg } from "./saveAsJpeg";
import { command as saveAsWorkspace } from "./saveAsWorkspace";
import { command as openWorkspace } from "./openWorkspace";
import { command as createActiveWorkspace } from "./createActiveWorkspace";
import { command as openCommandPalette } from "./openCommandPalette";
import { command as resetLayout } from "./resetLayout";
import { command as closeActiveWorkspace } from "./closeActiveWorkspace";
import { command as fitCanvasToWindow } from "./fitCanvasToWindow";
import { command as undoCanvasAction } from "./undoCanvasAction";
import { command as redoCanvasAction } from "./redoCanvasAction";
import { command as clearActiveWorkspace } from "./clearActiveWorkspace";
import { command as selectTool } from "./selectTool";
import { command as openAdjustmentsPopup } from "./openAdjustmentsPopup";

export const commands = {
  saveAsPng,
  saveAsJpeg,
  saveAsWorkspace,
  openWorkspace,
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
} as const;

export type CommandId = keyof typeof commands;
export type Command = (typeof commands)[keyof typeof commands];

type MapToExecuteCommand<U> = U extends Command
  ? Parameters<U["execute"]>[1] extends undefined
    ? [id: U["id"]]
    : [id: U["id"], params: Parameters<U["execute"]>[1]]
  : never;

export type ExecuteCommand = (
  ...[id, params]: MapToExecuteCommand<Command>
) => Promise<void>;

export type ExecuteCommandWithDefaults = (id: CommandId) => Promise<void>;
