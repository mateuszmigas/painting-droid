import { memo, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/utils/css";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Droid } from "../droid";
import { useWorkspacesStore } from "@/store";
import {
  activeWorkspaceCanvasDataSelector,
  activeLayerSelector,
} from "@/store/workspacesStore";
import { useChatModels } from "@/hooks";
import { getTranslations } from "@/translations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { readStream } from "@/utils/stream";

const chatTranslations = getTranslations().chat;

type ChatMessage =
  | {
      type: "user";
      text: string;
    }
  | ({ type: "assistant" } & ({ text: string } | { error: string }));

export const Chat = memo(() => {
  const models = useChatModels();
  const canvasData = useWorkspacesStore((state) =>
    activeWorkspaceCanvasDataSelector(state)
  );
  const activeLayer = activeLayerSelector(canvasData);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const [modelId, setModelId] = useState<string>(models[0]?.id);
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: "assistant", text: chatTranslations.welcomeMessage },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async () => {
    setIsProcessing(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: prompt },
    ]);
    setPrompt("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "assistant", text: "..." },
    ]);

    const { definition, config } = models.find(
      (model) => model.id === modelId
    )!;

    const updateLastMessage = (
      updater: (message: ChatMessage) => ChatMessage
    ) =>
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, prevMessages.length - 1),
        updater(prevMessages[prevMessages.length - 1]),
      ]);

    definition.chat
      .execute(
        modelId,
        prompt,
        activeLayer.data
          ? { ...canvasData.size, data: activeLayer.data }
          : null,
        {},
        config
      )
      .then((img) => {
        updateLastMessage(() => ({ type: "assistant", text: "" }));
        readStream(img, (chunk) => {
          updateLastMessage((lastMessage) =>
            "text" in lastMessage
              ? { ...lastMessage, text: lastMessage.text + chunk }
              : lastMessage
          );
        });
      })
      .catch((error) => {
        updateLastMessage(() => ({
          type: "assistant",
          error: error.message,
        }));
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    scrollTargetRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  if (models.length === 0) {
    return <div>{chatTranslations.errors.noModels}</div>;
  }

  return (
    <form
      className="h-full flex flex-col gap-medium"
      onSubmit={(e) => {
        e.preventDefault();
        if (prompt.length === 0 && isProcessing) {
          return;
        }
        sendMessage();
      }}
    >
      <Select onValueChange={setModelId} value={modelId}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="truncate max-w-[300px]">{model.display}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
                "text-destructive": "error" in message,
              })}
            >
              {"error" in message ? message.error : message.text}
            </div>
          ))}
        </div>
        <div ref={scrollTargetRef} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex flex-row gap-medium">
        <Input
          autoFocus
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button
          disabled={prompt.length === 0 || isProcessing}
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

