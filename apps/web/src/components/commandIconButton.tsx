import { type CommandId, commands } from "@/commands";
import { type KeyGesture, keyGestureToString } from "@/utils/keyGesture";
import { IconButton } from "./icons/iconButton";
import { useCommandService } from "@/contexts/commandService";
import type { IconSize, IconType } from "./icons/icon";

const createCommandTooltip = (name: string, keyGesture?: KeyGesture) => {
  if (keyGesture) {
    return `${name} (${keyGestureToString(keyGesture)})`;
  }
  return name;
};

export const CommandIconButton = (props: {
  commandId: CommandId;
  size?: IconSize;
  icon?: IconType;
  disabled?: boolean;
}) => {
  const { commandId, icon, size = "small", disabled } = props;
  const command = commands[commandId]!;
  const { executeCommandWithDefaults } = useCommandService();
  return (
    <IconButton
      title={createCommandTooltip(
        command.display ?? "",
        command.defaultKeyGesture
      )}
      type={icon ?? command.icon ?? "command"}
      size={size}
      disabled={disabled}
      onClick={() => executeCommandWithDefaults(commandId)}
    />
  );
};

