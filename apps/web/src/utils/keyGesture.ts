import type { Key } from "./key";

export type KeyGesture = {
  key: Key;
  ctrl: boolean;
  shift: boolean;
  meta: boolean;
  alt: boolean;
};

export const createKeyGesture = (input: {
  key: Key;
  ctrl?: boolean;
  shift?: boolean;
  meta?: boolean;
  alt?: boolean;
}): KeyGesture => ({
  key: input.key,
  ctrl: input.ctrl || false,
  shift: input.shift || false,
  meta: input.meta || false,
  alt: input.alt || false,
});

export const keyGestureToString = (keyGesture: KeyGesture) =>
  [
    ...Array.from(
      `${keyGesture.ctrl ? "⌃" : ""}${keyGesture.alt ? "⌥" : ""}${
        keyGesture.shift ? "⇧" : ""
      }${keyGesture.meta ? "⌘" : ""}`
    ),
    keyGesture.key,
  ].join("+");

const mapCodeToKey = (code: string): Key => {
  return code.toUpperCase() as Key;
};

export const eventToKeyGesture = (
  e: KeyboardEvent | React.KeyboardEvent<Element>
): KeyGesture => ({
  key: mapCodeToKey(e.key),
  alt: e.altKey,
  shift: e.shiftKey,
  meta: e.metaKey,
  ctrl: e.ctrlKey,
});

