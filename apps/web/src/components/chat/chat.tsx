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
import { ChatSuggestion } from "./chatSuggestion";
import { ChatMessageRow } from "./chatMessageRow";
import {
  PromiseCancellationTokenSource,
  makeCancellableWithToken,
} from "@/utils/promise";
import { features } from "@/features";
import type { ChatAction, ChatActionKey } from "@/types/chat";
import { useChatStore } from "@/store/chatStore";

const translations = getTranslations();
const chatTranslations = translations.chat;

const actions: ChatAction[] = Object.entries(adjustmentsMetadata).map(
  ([key, value]) => {
    return { key, description: value.name };
  }
);

const filterValidActions = (actions: ChatActionKey[]) => {
  if (!Array.isArray(actions)) {
    return [];
  }
  return actions.filter(
    (action) => typeof action === "string" && action in adjustmentsMetadata
  );
};

export const Chat = memo(() => {
  const {
    messages,
    addMessage,
    updateLastMessage,
    removeLastMessage,
    clearMessages,
  } = useChatStore();
  const models = useChatModels();
  const canvasData = useWorkspacesStore((state) =>
    activeWorkspaceCanvasDataSelector(state)
  );
  const activeLayer = activeLayerSelector(canvasData);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const [modelId, setModelId] = useState<string>(models[0]?.id);
  const [prompt, setPrompt] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fetchActionsTokenSource = useRef<PromiseCancellationTokenSource>();

  const sendMessage = async (prompt: string) => {
    setIsProcessing(true);
    addMessage({ type: "user", text: prompt });
    setPrompt("");
    addMessage({ type: "assistant", text: "..." });

    const { definition, config } = models.find(
      (model) => model.id === modelId
    )!;

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

      if (!features.chatActions) {
        return;
      }
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
    removeLastMessage();
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
      <div className="flex flex-row items-center gap-medium">
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
        <Button
          disabled={isProcessing}
          variant="outline"
          type="button"
          onClick={clearMessages}
        >
          {translations.general.clear}
        </Button>
      </div>
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
      {messages.length === 1 && (
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

