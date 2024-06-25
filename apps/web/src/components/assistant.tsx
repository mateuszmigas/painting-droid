import { cn } from "@/utils/css";
import { memo } from "react";
import { Chat } from "./chat";

export const Assistant = memo((props: { className?: string }) => {
  const { className } = props;
  return (
    <div className={cn("w-64 h-96 border rounded-md overflow-auto", className)}>
      <Chat />
    </div>
  );
});

