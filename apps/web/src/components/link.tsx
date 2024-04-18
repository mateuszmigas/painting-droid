import { cn } from "@/utils/css";
import { type AnchorHTMLAttributes, forwardRef } from "react";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { href, className, ...rest } = props;

  return (
    <a
      ref={ref}
      {...rest}
      className={cn(
        "text-primary underline-offset-4 hover:underline",
        className
      )}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {props.children}
    </a>
  );
});

