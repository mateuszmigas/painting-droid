import { memo, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
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
import { adjustmentsMetadata } from "@/adjustments";
import type { ChatAction, ChatActionKey } from "@/models/types/chatModel";
import { ChatSuggestion } from "./chatSuggestion";
import { ChatMessageRow } from "./chatMessageRow";
import type { ChatMessage } from "./types";
import {
  PromiseCancellationTokenSource,
  makeCancellableWithToken,
} from "@/utils/promise";

const chatTranslations = getTranslations().chat;

const actions: ChatAction[] = Object.entries(adjustmentsMetadata).map(
  ([key, value]) => {
    return { key, description: value.name };
  }
);

const filterValidActions = (actions: ChatActionKey[]) => {
  console.log("filtering", actions);
  if (!Array.isArray(actions)) {
    return [];
  }
  return actions.filter(
    (action) => typeof action === "string" && action in adjustmentsMetadata
  );
};

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
  const [showSuggestions, setShotSuggestions] = useState(true);
  const fetchActionsTokenSource = useRef<PromiseCancellationTokenSource>();

  const sendMessage = async (prompt: string) => {
    setShotSuggestions(false);
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

    const image = activeLayer.data
      ? { ...canvasData.size, data: activeLayer.data }
      : null;

    try {
      const { stream, getActions } = await definition.chat.execute(
        modelId,
        prompt,
        image,
        actions,
        {},
        config
      );

      updateLastMessage(() => ({ type: "assistant", text: "" }));

      await readStream(stream, (chunk) =>
        updateLastMessage((lastMessage) =>
          "text" in lastMessage
            ? { ...lastMessage, text: lastMessage.text + chunk }
            : lastMessage
        )
      );

      updateLastMessage((message) => ({ ...message, actions: [] }));

      fetchActionsTokenSource.current = new PromiseCancellationTokenSource();
      makeCancellableWithToken(
        getActions(),
        fetchActionsTokenSource.current.getToken()
      ).then((actionKeys) => {
        updateLastMessage((message) => ({
          ...message,
          actions: filterValidActions(actionKeys),
        }));
      });
    } catch {
      updateLastMessage(() => ({
        type: "assistant",
        error: "Error",
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const retry = async () => {
    fetchActionsTokenSource.current?.cancel();
    const userMessage = messages[messages.length - 2];
    if (userMessage.type !== "user") {
      return;
    }
    setMessages((prevMessages) => prevMessages.slice(0, -2));
    await sendMessage(userMessage.text);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to trigger scrollIntoView on messages change
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
        sendMessage(prompt);
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
            // biome-ignore lint/suspicious/noArrayIndexKey: it's fine to use index as key here
            <ChatMessageRow key={index} message={message} onRetry={retry} />
          ))}
        </div>
        <div ref={scrollTargetRef} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {showSuggestions && (
        <div className="flex flex-col gap-small">
          {chatTranslations.suggestions.map((suggestion, index) => (
            <ChatSuggestion
              // biome-ignore lint/suspicious/noArrayIndexKey: it's fine to use index as key here
              key={index}
              suggestion={suggestion}
              onClick={() => sendMessage(suggestion)}
            />
          ))}
        </div>
      )}
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

