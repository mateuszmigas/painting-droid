import { describe, expect, test, vi } from "vitest";
import { create } from "zustand";
import { settingsStoreCreator } from "./settingsStore";

vi.mock("@tauri-apps/api/core", () => ({}));

describe("settingsStore", () => {
  test("Sets theme correctly", () => {
    const store = create(settingsStoreCreator);

    store.getState().setTheme("dark");
    store.getState().setTheme("light");
    expect(store.getState().theme).toBe("light");
  });
});
