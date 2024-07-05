import type { ChatMessage } from "@/types/chat";
import { create, type StateCreator } from "zustand";
import { getTranslations } from "@/translations";

type AppChatState = {
  messages: ChatMessage[];
};

const getDefaultMessages = (): ChatMessage[] => [
  { type: "assistant", text: getTranslations().chat.welcomeMessage },
];
const defaultState: AppChatState = {
  messages: getDefaultMessages(),
};

type AppChatSlice = AppChatState & {
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (updater: (message: ChatMessage) => ChatMessage) => void;
  removeLastMessage: () => void;
  clearMessages: () => void;
};

export const chatStoreCreator: StateCreator<AppChatSlice> = (set) => ({
  ...defaultState,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (updater) =>
    set((state) => ({
      messages: [
        ...state.messages.slice(0, state.messages.length - 1),
        updater(state.messages[state.messages.length - 1]),
      ],
    })),
  removeLastMessage: () =>
    set((state) => ({
      messages: state.messages.slice(0, state.messages.length - 1),
    })),
  clearMessages: () => set({ messages: getDefaultMessages() }),
});

export const useChatStore = create<AppChatSlice>(chatStoreCreator);

