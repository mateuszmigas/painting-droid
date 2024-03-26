import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { memo, useMemo } from "react";
import {
  useCommandPaletteStore,
  useLayoutStore,
  useToolStore,
  useWorkspacesStore,
} from "@/store";
import { useCanvasActionDispatcher, useStableCallback } from "@/hooks";
import {
  type CommandId,
  commands,
  type ExecuteCommand,
  type ExecuteCommandWithDefaults,
} from "@/commands";
import { Icon } from "./icons/icon";
import { CommandServiceContext } from "@/contexts/commandService";
import type { CommandContext } from "@/commands/context";
import { useDialogService } from "@/contexts/dialogService";
import { sortBySelector } from "@/utils/array";
import { useCanvasContextStore } from "@/contexts/canvasContextService";

export type CommandService = {
  executeCommandWithDefaults: ExecuteCommandWithDefaults;
  executeCommand: ExecuteCommand;
};

export const CommandPaletteHost = memo(
  (props: { children: React.ReactNode }) => {
    const { children } = props;
    const { isOpen, setIsOpen } = useCommandPaletteStore((store) => store);
    const canvasActionDispatcher = useCanvasActionDispatcher();
    const { activeContext } = useCanvasContextStore();
    const getActiveCanvasContext = useStableCallback(() => activeContext);
    const dialogService = useDialogService();
    const commandService = useMemo<CommandService>(() => {
      const createContext = (): CommandContext => ({
        stores: {
          workspaces: () => useWorkspacesStore.getState(),
          commandPalette: () => useCommandPaletteStore.getState(),
          layout: () => useLayoutStore.getState(),
          tool: () => useToolStore.getState(),
        },
        dialogService,
        canvasActionDispatcher,
        getActiveCanvasContext,
      });
      const executeCommand: ExecuteCommand = async (...[id, params]) => {
        const context = createContext();
        const command = commands[id as CommandId];
        if (!command) {
          throw new Error(`Command not found: ${id}`);
        }
        return command.execute(context, params as never);
      };
      const executeCommandWithDefaults: ExecuteCommandWithDefaults = async (
        id
      ) => executeCommand(id as never);

      return {
        executeCommand,
        executeCommandWithDefaults,
      };
    }, [dialogService, canvasActionDispatcher, getActiveCanvasContext]);

    const sortedCommands = sortBySelector(
      Object.values(commands).filter(
        (command) => command.options.showInPalette
      ),
      (command) => command.display,
      true
    );

    return (
      <CommandServiceContext.Provider value={commandService}>
        <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {sortedCommands.map((command) => (
              <CommandItem
                onSelect={() => {
                  commandService.executeCommand(command.id as never);
                  setIsOpen(false);
                }}
                key={command.display}
                className="m-1 h-8"
              >
                <Icon
                  type={command.icon ?? "command"}
                  size="small"
                  className="mr-2 min-h-5 min-w-5"
                />
                <span className="truncate">{command.display}</span>
              </CommandItem>
            ))}
          </CommandList>
        </CommandDialog>
        {children}
      </CommandServiceContext.Provider>
    );
  }
);
