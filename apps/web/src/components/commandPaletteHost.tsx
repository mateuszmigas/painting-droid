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
import type { CommandContext } from "@/commands/context";
import { useDialogService } from "@/contexts/dialogService";
import { sortBySelector } from "@/utils/array";
import { useCanvasPreviewContextStore } from "@/contexts/canvasPreviewContextStore";
import { useNotificationService } from "@/contexts/notificationService";

export type CommandService = {
  executeCommandWithDefaults: ExecuteCommandWithDefaults;
  executeCommand: ExecuteCommand;
};

export const CommandPaletteHost = memo(
  (props: { setCommandService: (commandService: CommandService) => void }) => {
    const { setCommandService } = props;
    const { isOpen, setIsOpen } = useCommandPaletteStore((store) => store);
    const canvasActionDispatcher = useCanvasActionDispatcher();
    const { previewContext } = useCanvasPreviewContextStore();
    const getActiveCanvasContext = useStableCallback(() => previewContext);
    const dialogService = useDialogService();
    const notificationService = useNotificationService();
    const commandService = useMemo<CommandService | null>(() => {
      if (!dialogService || !notificationService || !canvasActionDispatcher) {
        return null;
      }
      const createContext = (): CommandContext => ({
        stores: {
          workspaces: () => useWorkspacesStore.getState(),
          commandPalette: () => useCommandPaletteStore.getState(),
          layout: () => useLayoutStore.getState(),
          tool: () => useToolStore.getState(),
        },
        dialogService,
        notificationService,
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
    }, [
      dialogService,
      notificationService,
      canvasActionDispatcher,
      getActiveCanvasContext,
    ]);

    useEffect(() => {
      commandService && setCommandService(commandService);
    }, [setCommandService, commandService]);

    const sortedCommands = sortBySelector(
      Object.values(commands).filter(
        (command) => command.options.showInPalette
      ),
      (command) => command.display,
      true
    );

    return (
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {sortedCommands.map((command) => (
            <CommandItem
              onSelect={() => {
                commandService!.executeCommand(command.id as never);
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
    );
  }
);
