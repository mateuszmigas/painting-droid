import { command as saveCurrentWorkspaceAsFile } from "./saveCurrentWorkspaceAsFile";
import { command as createActiveWorkspace } from "./createActiveWorkspace";
import { command as openCommandPalette } from "./openCommandPalette";
import { command as resetLayout } from "./resetLayout";
import { command as closeActiveWorkspace } from "./closeActiveWorkspace";
import { command as fitCanvasToWindow } from "./fitCanvasToWindow";
import { command as undoCanvasAction } from "./undoCanvasAction";
import { command as redoCanvasAction } from "./redoCanvasAction";
import { command as clearActiveWorkspace } from "./clearActiveWorkspace";
import { command as selectTool } from "./selectTool";

export const commands = {
  saveCurrentWorkspaceAsFile,
  createActiveWorkspace,
  openCommandPalette,
  resetLayout,
  closeActiveWorkspace,
  fitCanvasToWindow,
  undoCanvasAction,
  redoCanvasAction,
  clearActiveWorkspace,
  selectTool,
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
