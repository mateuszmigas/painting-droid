import { memo } from "react";
import { Chat } from "../chat/chat";

export const ChatPopup = memo(() => {
  return (
    <div
      style={{
        maxHeight: "calc(var(--radix-popper-available-height) - 60px)",
        maxWidth: "calc(var(--radix-popper-available-width) - 120px)",
      }}
      className="w-[600px] h-[800px]"
    >
      <Chat />
    </div>
  );
});

