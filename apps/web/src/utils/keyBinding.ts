import type { KeyGesture } from "./keyGesture";

export type KeyBinding = {
  keyGesture: KeyGesture;
  command: string;
};
