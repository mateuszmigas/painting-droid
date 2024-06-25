import { memo } from "react";
import { Chat } from "../chat/chat";

export const ChatPopup = memo(() => {
  return (
    <div
      style={{ maxHeight: "calc(var(--radix-popper-available-height) - 60px)" }}
      className="w-[400px] h-[500px]"
    >
      <Chat />
    </div>
  );
});

