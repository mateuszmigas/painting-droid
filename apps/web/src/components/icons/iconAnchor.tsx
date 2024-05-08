import { cn } from "@/utils/css";
import { type IconType, type IconSize, Icon } from "./icon";
import { type AnchorHTMLAttributes, forwardRef } from "react";

type IconAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "type"
> & {
  type: IconType;
  size: IconSize;
  href: string;
  className?: string;
  iconClassName?: string;
  title?: string;
};

export const IconAnchor = forwardRef<HTMLAnchorElement, IconAnchorProps>(
  (props, ref) => {
    const { type, size, href, className, iconClassName, title, ...rest } =
      props;

    return (
      <a
        ref={ref}
        {...rest}
        className={cn(
          "hover:bg-accent rounded-md hover:text-accent-foreground p-1",
          className
        )}
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={title}
        title={title}
      >
        <Icon type={type} size={size} className={iconClassName} />
      </a>
    );
  }
);

