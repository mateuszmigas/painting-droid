import { Key } from "./key";

export type KeyGesture = {
  key: Key;
  ctrl: boolean;
  shift: boolean;
  meta: boolean;
  alt: boolean;
};

