import { IconType } from "@/components/icon";
import { CommandContext } from "./context";
import { KeyGesture } from "@/utils/keyGesture";

export const createCommand = <
  T extends string,
  C extends (context: CommandContext, payload: any) => Promise<void>
>(command: {
  id: T;
  name: string;
  execute: C;
  icon: IconType;
  defaultKeyGesture?: KeyGesture;
  options: {
    showInPalette: boolean;
  };
}) => command;

