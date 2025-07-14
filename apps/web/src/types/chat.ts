export type ChatActionKey = string;
export type ChatAction = {
  key: ChatActionKey;
  description: string;
};

export type ChatMessage =
  | {
      type: "user";
      text: string;
    }
  | ({ type: "assistant" } & ({ text: string; actions?: ChatActionKey[] } | { error: string }));
