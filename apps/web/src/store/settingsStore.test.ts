import { describe, expect, test } from "vitest";
import { settingsStoreCreator } from "./settingsStore";
import { create } from "zustand";

describe("settingsStore", () => {
  test("Sets theme correctly", () => {
    const store = create(settingsStoreCreator);

    store.getState().setTheme("dark");
    store.getState().setTheme("light");
    expect(store.getState().theme).toBe("light");
  });
});

