import type { IconType } from "@/components/icons/icon";
import type { CommandContext } from "./context";
import type { KeyGesture } from "@/utils/keyGesture";

export const createCommand = <
  T extends string,
  C extends (context: CommandContext, payload: never) => Promise<void>
>(command: {
  id: T;
  display?: string;
  execute: C;
  icon?: IconType;
  defaultKeyGesture?: KeyGesture;
  options: {
    showInPalette: boolean;
  };
}) => command;
