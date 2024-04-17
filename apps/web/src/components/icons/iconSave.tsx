import { type IconSize, Icon } from "./icon";
import { IconButton } from "./iconButton";

export const IconSave = (props: {
  saved: boolean;
  setSaved: () => void;
  size: IconSize;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <div
      className={`relative flex items-center justify-center ${props.className}`}
    >
      <Icon
        className={`absolute transition-all text-green-500 hover:text-green-500 ${
          props.saved ? "scale-100 rotate-0" : "scale-0 -rotate-90"
        }`}
        type={"check"}
        size={props.size}
      />
      <IconButton
        disabled={props.disabled}
        className={`absolute transition-all text-primary hover:text-primary ${
          !props.saved ? "scale-100 rotate-0" : "scale-0 rotate-90"
        }`}
        type={"save"}
        size={props.size}
        onClick={() => props.setSaved()}
      />
    </div>
  );
};

