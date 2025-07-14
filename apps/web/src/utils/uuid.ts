import { nanoid } from "nanoid";

export const uuid = () => {
  if ("randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }
  return nanoid();
};
