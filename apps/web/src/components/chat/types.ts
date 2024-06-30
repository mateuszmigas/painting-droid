import type { ChatActionKey } from "@/models/types/chatModel";

export type ChatMessage =
  | {
      type: "user";
      text: string;
    }
  | ({ type: "assistant" } & (
      | { text: string; actions?: ChatActionKey[] }
      | { error: string }
    ));

