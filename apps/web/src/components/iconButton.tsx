import { cn } from "@/utils/css";
import { type IconType, type IconSize, Icon } from "./icon";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "type"
> & {
  type: IconType;
  size: IconSize;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  iconClassName?: string;
  title?: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const { type, size, onClick, className, iconClassName, ...rest } = props;

    return (
      <button
        type="button"
        ref={ref}
        {...rest}
        className={cn(
          "hover:bg-accent rounded-md hover:text-accent-foreground p-1",
          className
        )}
        onClick={onClick}
      >
        <Icon type={type} size={size} className={iconClassName} />
      </button>
    );
  }
);

