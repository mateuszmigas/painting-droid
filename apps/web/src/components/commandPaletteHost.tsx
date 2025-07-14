import { memo, useEffect, useMemo } from "react";
import { type CommandId, commands, type ExecuteCommand, type ExecuteCommandWithDefaults } from "@/commands";
import type { CommandContext } from "@/commands/context";
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useDialogService } from "@/contexts/dialogService";
import { useNotificationService } from "@/contexts/notificationService";
import { useCanvasActionDispatcher } from "@/hooks";
import { useCommandPaletteStore, useLayoutStore, useToolStore, useWorkspacesStore } from "@/store";
import { getTranslations } from "@/translations";
import { sortBySelector } from "@/utils/array";
import { Icon } from "./icons/icon";

const commandPaletteTranslations = getTranslations().commandPalette;

export type CommandService = {
  executeCommandWithDefaults: ExecuteCommandWithDefaults;
  executeCommand: ExecuteCommand;
};

export const CommandPaletteHost = memo((props: { setCommandService: (commandService: CommandService) => void }) => {
  const { setCommandService } = props;
  const { isOpen, setIsOpen } = useCommandPaletteStore((store) => store);
  const canvasActionDispatcher = useCanvasActionDispatcher();
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
    });
    const executeCommand: ExecuteCommand = async (...[id, params]) => {
      const context = createContext();
      const command = commands[id as CommandId];
      if (!command) {
        throw new Error(`Command not found: ${id}`);
      }
      return command.execute(context, params as never);
    };
    const executeCommandWithDefaults: ExecuteCommandWithDefaults = async (id) => executeCommand(id as never);

    return {
      executeCommand,
      executeCommandWithDefaults,
    };
  }, [dialogService, notificationService, canvasActionDispatcher]);

  useEffect(() => {
    commandService && setCommandService(commandService);
  }, [setCommandService, commandService]);

  const sortedCommands = sortBySelector(
    Object.values(commands).filter((command) => command.config.showInPalette),
    (command) => command.display,
    true,
  );

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput placeholder={commandPaletteTranslations.placeholder} />
      <CommandList>
        <CommandEmpty>{commandPaletteTranslations.noResults}</CommandEmpty>
        {sortedCommands.map((command) => (
          <CommandItem
            onSelect={() => {
              commandService!.executeCommand(command.id as never);
              setIsOpen(false);
            }}
            key={command.display}
            className="m-1 h-8"
          >
            <Icon type={command.icon ?? "command"} size="small" className="mr-2 min-h-5 min-w-5" />
            <span className="truncate">{command.display}</span>
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
});
