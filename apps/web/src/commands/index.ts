import { command as saveAsCurrentWorkspace } from "./saveAsCurrentWorkspace";
import { command as addWorkspaceLayer } from "./addWorkspaceLayer";
import { CommandContext } from "./context";
const commands = [saveAsCurrentWorkspace, addWorkspaceLayer] as const;
const commandByName = new Map(
  commands.map((command) => [command.name, command])
);

export type Command = (typeof commands)[number];
export type CommandId = Command["name"];

type MapToExecuteCommand<U> = U extends Command
  ? Parameters<U["execute"]>[1] extends undefined
    ? [name: U["name"]]
    : [name: U["name"], params: Parameters<U["execute"]>[1]]
  : never;

const createContext = (): CommandContext => ({});

export const executeCommand = async (
  ...[name, params]: MapToExecuteCommand<Command>
) => {
  const context = createContext();
  const command = commandByName.get(name);

  if (!command) {
    throw new Error(`Command not found: ${name}`);
  }

  return command.execute(context, params);
};

