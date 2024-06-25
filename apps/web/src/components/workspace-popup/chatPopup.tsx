import { memo } from "react";
import { Chat } from "../chat/chat";

export const ChatPopup = memo(() => {
  return (
    <div className="w-[400px] h-[400px]">
      <Chat />
    </div>
  );
});

