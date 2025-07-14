import { cn } from "@/utils/css";

export const AiLabel = (props: { size: number; className?: string }) => {
  const { size, className } = props;
  return (
    <div
      style={{
        fontSize: `${size / 1.5}px`,
        lineHeight: `${size * 1.1}px`,
        width: `${size * 1.25}px`,
        height: `${size}px`,
      }}
      className={cn("bg-primary text-primary-foreground rounded-md text-center font-mono", className)}
    >
      AI
    </div>
  );
};
