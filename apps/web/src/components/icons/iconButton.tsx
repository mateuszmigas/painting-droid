import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/css";
import { Icon, type IconSize, type IconType } from "./icon";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type"> & {
  type: IconType;
  size: IconSize;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  iconClassName?: string;
  title?: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { type, size, onClick, className, iconClassName, ...rest } = props;

  return (
    <button
      type="button"
      ref={ref}
      {...rest}
      className={cn(
        "focus:outline-primary hover:bg-accent rounded-md hover:text-accent-foreground p-1 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      onClick={onClick}
    >
      <Icon type={type} size={size} className={iconClassName} />
    </button>
  );
});
