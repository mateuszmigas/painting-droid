import type { IconType } from "@/components/icons/icon";
import type { KeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";

export const createCommand = <
  T extends string,
  C extends (context: CommandContext, payload: never) => Promise<void>,
>(command: {
  id: T;
  display?: string;
  execute: C;
  icon?: IconType;
  defaultKeyGesture?: KeyGesture;
  config: {
    showInPalette: boolean;
  };
}) => command;
