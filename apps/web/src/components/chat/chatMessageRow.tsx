import { cn } from "@/utils/css";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { ChatActions } from "./chatActions";
import type { ChatMessage } from "@/types/chat";

export const ChatMessageRow = memo(
  (props: { message: ChatMessage; onRetry: () => void }) => {
    const { message, onRetry } = props;
    return (
      <div
        className={cn("animate-fade-in rounded-lg py-small px-medium", {
          "bg-primary text-primary-foreground self-end":
            message.type === "user",
          "w-full": message.type === "assistant",
          "text-destructive": "error" in message,
        })}
      >
        {message.type === "assistant" ? (
          <>
            <ReactMarkdown>
              {"error" in message ? message.error : message.text}
            </ReactMarkdown>
            {"actions" in message && message.actions && (
              <ChatActions
                actions={message.actions}
                onCopy={() => navigator.clipboard.writeText(message.text)}
                onRetry={onRetry}
              />
            )}
          </>
        ) : (
          message.text
        )}
      </div>
    );
  }
);

