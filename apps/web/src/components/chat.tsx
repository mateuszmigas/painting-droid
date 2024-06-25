import { memo, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { cn } from "@/utils/css";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

type ChatMessage = {
  type: "user" | "assistant";
  text: string;
  attachments?: string[];
};

export const Chat = memo(() => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: "assistant", text: "Hello! How can I help you?" },
    { type: "user", text: "Hi!" },
    { type: "assistant", text: "How are you?" },
    { type: "user", text: "I'm fine, thanks!" },
    { type: "assistant", text: "Hello! How can I help you?" },
    { type: "user", text: "Hi!" },
    { type: "assistant", text: "How are you?" },
    { type: "user", text: "I'm fine, thanks!" },
    { type: "assistant", text: "Hello! How can I help you?" },
    { type: "user", text: "Hi!" },
    { type: "assistant", text: "How are you?" },
    { type: "user", text: "I'm fine, thanks!" },
  ]);

  const sendMessage = (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: message },
    ]);
    setPrompt("");
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "assistant", text: "I'm a bot, I don't understand that." },
      ]);
    }, 1000);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    scrollTargetRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <form
      className="bg-popover h-full flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(prompt);
      }}
    >
      <ScrollArea ref={scrollAreaRef} className="flex-1 mt-medium">
        <div className="flex flex-col gap-medium p-medium">
          {messages.map((message, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              className={cn("rounded-lg py-small px-medium", {
                "bg-primary self-end": message.type === "user",
                "bg-secondary self-start": message.type === "assistant",
              })}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div ref={scrollTargetRef} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex flex-row gap-medium p-medium">
        <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <Button type="submit">Send</Button>
      </div>
    </form>
  );
});

