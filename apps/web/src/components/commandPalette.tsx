import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { memo, useEffect } from "react";
import { useCommandPaletteStore } from "@/store";
import { useStableCallback } from "@/hooks";
import { commands, executeCommand } from "@/commands";
import { Icon } from "./icon";

export const CommandPalette = memo(() => {
  const { isOpen, setIsOpen } = useCommandPaletteStore((store) => store);

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

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands
          .filter((command) => command.options.showInPalette)
          .map((command) => (
            <CommandItem
              onSelect={() => {
                executeCommand(command.id as never);
                setIsOpen(false);
              }}
              key={command.name}
              className="m-1 h-8"
            >
              <Icon
                type={command.icon}
                size="small"
                className="mr-2 min-h-5 min-w-5"
              />
              <span className="truncate">{command.name}</span>
            </CommandItem>
          ))}
      </CommandList>
    </CommandDialog>
  );
});
