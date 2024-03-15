import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { memo, useEffect, useMemo } from "react";
import {
  useCommandPaletteStore,
  useLayoutStore,
  useWorkspacesStore,
} from "@/store";
import { useStableCallback } from "@/hooks";
import {
  commands,
  type ExecuteCommand,
  type ExecuteCommandWithDefaults,
  commandById,
} from "@/commands";
import { Icon } from "./icon";
import { CommandServiceContext } from "@/contexts/commandService";
import type { CommandContext } from "@/commands/context";
import { useDialogService } from "@/contexts/dialogService";

export type CommandService = {
  executeCommandWithDefaults: ExecuteCommandWithDefaults;
  executeCommand: ExecuteCommand;
};

export const CommandPaletteHost = memo(
  (props: { children: React.ReactNode }) => {
    const { children } = props;
    const { isOpen, setIsOpen } = useCommandPaletteStore((store) => store);
    const dialogService = useDialogService();

    const toggleIsOpen = useStableCallback(() => {
      setIsOpen(!isOpen);
    });

    useEffect(() => {
      const down = (e: KeyboardEvent) => {
        //todo: configurable keybinding
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          toggleIsOpen();
        }
      };

      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
    }, [toggleIsOpen]);

    const commandService = useMemo<CommandService>(() => {
      const createContext = (): CommandContext => ({
        stores: {
          workspaces: () => useWorkspacesStore.getState(),
          commandPalette: () => useCommandPaletteStore.getState(),
          layout: () => useLayoutStore.getState(),
        },
        dialogService,
      });
      const executeCommand: ExecuteCommand = async (...[id, params]) => {
        const context = createContext();
        const command = commandById.get(id);
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
    }, [dialogService]);

    return (
      <CommandServiceContext.Provider value={commandService}>
        <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {commands
              .filter((command) => command.options.showInPalette)
              .map((command) => (
                <CommandItem
                  onSelect={() => {
                    commandService.executeCommand(command.id as never);
                    setIsOpen(false);
                  }}
                  key={command.display}
                  className="m-1 h-8"
                >
                  <Icon
                    type={command.icon}
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
