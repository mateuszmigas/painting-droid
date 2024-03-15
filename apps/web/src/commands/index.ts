import { command as saveCurrentWorkspaceAsFile } from "./saveCurrentWorkspaceAsFile";
import { command as createActiveWorkspace } from "./createActiveWorkspace";
import { command as openCommandPalette } from "./openCommandPalette";
import { command as resetLayout } from "./resetLayout";
import { command as closeActiveWorkspace } from "./closeActiveWorkspace";
import { command as fitCanvasToWindow } from "./fitCanvasToWindow";

export const commands = [
  saveCurrentWorkspaceAsFile,
  createActiveWorkspace,
  openCommandPalette,
  resetLayout,
  closeActiveWorkspace,
  fitCanvasToWindow,
] as const;

export const commandById = new Map(
  commands.map((command) => [command.id, command])
);

export type Command = (typeof commands)[number];
export type CommandId = Command["id"];

type MapToExecuteCommand<U> = U extends Command
  ? Parameters<U["execute"]>[1] extends undefined
    ? [id: U["id"]]
    : [id: U["id"], params: Parameters<U["execute"]>[1]]
  : never;

export type ExecuteCommand = (
  ...[id, params]: MapToExecuteCommand<Command>
) => Promise<void>;

export type ExecuteCommandWithDefaults = (id: CommandId) => Promise<void>;
