import { type CommandId, commands, type ExecuteCommand } from "@/commands";
import { eventToKeyGesture, keyGestureToString } from "@/utils/keyGesture";
import { useEffect, useMemo } from "react";

const ignoredCommandsIds = new Set<string>();

export const setIgnoredCommands = (commandIds: string[]) => {
  commandIds.forEach((commandId) => {
    ignoredCommandsIds.add(commandId);
  });
};

export const useGlobalKeyboardHandler = (executeCommand: ExecuteCommand) => {
  const commandByKeyGesture = useMemo(() => {
    return Object.values(commands).reduce((map, command) => {
      if (command.defaultKeyGesture) {
        map.set(keyGestureToString(command.defaultKeyGesture), command.id);
      }
      return map;
    }, new Map<string, CommandId>());
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const keyGestureString = keyGestureToString(eventToKeyGesture(e));
      const commandId = commandByKeyGesture.get(keyGestureString);

      if (commandId && !ignoredCommandsIds.has(commandId)) {
        executeCommand(commandId as never);
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [executeCommand, commandByKeyGesture]);
};

