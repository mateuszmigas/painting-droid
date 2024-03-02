import { cn } from "@/utils/css";
import { IconType, IconSize, Icon } from "./icon";

export const IconButton = (props: {
  type: IconType;
  size: IconSize;
  onClick: () => void;
  className?: string;
  iconClassName?: string;
}) => {
  const { type, size, onClick, className, iconClassName } = props;
  return (
    <button
      className={cn(
        "hover:bg-accent rounded-md hover:text-accent-foreground p-1",
        className
      )}
      onClick={onClick}
    >
      <Icon type={type} size={size} className={iconClassName} />
    </button>
  );
};

