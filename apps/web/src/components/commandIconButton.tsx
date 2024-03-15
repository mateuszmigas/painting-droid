import { type CommandId, commandById } from "@/commands";
import { type KeyGesture, keyGestureToString } from "@/utils/keyGesture";
import { IconButton } from "./iconButton";
import { useCommandService } from "@/contexts/commandService";

const createCommandTooltip = (name: string, keyGesture?: KeyGesture) => {
  if (keyGesture) {
    return `${name} (${keyGestureToString(keyGesture)})`;
  }
  return name;
};

export const CommandIconButton = (props: { commandId: CommandId }) => {
  const { commandId } = props;
  const command = commandById.get(commandId)!;
  const { executeCommandWithDefaults } = useCommandService();
  return (
    <IconButton
      title={createCommandTooltip(command.display, command.defaultKeyGesture)}
      type={command.icon}
      size="small"
      onClick={() => executeCommandWithDefaults(commandId)}
    />
  );
};

