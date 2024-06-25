import { memo, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/utils/css";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Droid } from "../droid";
import { sendMessageToAssistant } from "./api";
import { useWorkspacesStore } from "@/store";
import {
  activeWorkspaceCanvasDataSelector,
  activeLayerSelector,
} from "@/store/workspacesStore";
import { blobToBase64 } from "@/utils/image";

type ChatMessage = {
  type: "user" | "assistant";
  text: string;
  attachments?: string[];
};

export const Chat = memo(() => {
  const canvasData = useWorkspacesStore((state) =>
    activeWorkspaceCanvasDataSelector(state)
  );
  const activeLayer = activeLayerSelector(canvasData);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: "assistant", text: "Hello! How can I help you?" },
  ]);

  const sendMessage = async (prompt: string) => {
    //todo
    if (!activeLayer) return;
    const base64 = await blobToBase64(activeLayer.data!);
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: prompt },
    ]);
    setPrompt("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "assistant", text: "..." },
    ]);
    sendMessageToAssistant(prompt, [base64], (message, done) => {
      if (done) return;

      //update last message
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        return [
          ...prevMessages.slice(0, prevMessages.length - 1),
          { ...lastMessage, text: message },
        ];
      });
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    scrollTargetRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  return (
    <form
      className="h-full flex flex-col gap-medium"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(prompt);
      }}
    >
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="flex flex-col gap-medium">
          {messages.map((message, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              className={cn("rounded-lg py-small px-medium", {
                "bg-primary text-input-foreground self-end":
                  message.type === "user",
                "self-start": message.type === "assistant",
              })}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div ref={scrollTargetRef} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex flex-row gap-medium">
        <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <Button
          disabled={prompt.length === 0}
          variant="outline"
          type="submit"
          className="px-medium"
        >
          <div className="w-6">
            <Droid typingDurationSeconds={0} />
          </div>
        </Button>
      </div>
    </form>
  );
});

