import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import type { themes } from "@/constants";
import { type ModelType, modelDefinitions } from "@/models/definitions";
import { takeFirst } from "@/utils/array";
import { areColorsEqual, type RgbaColor } from "@/utils/color";
import { uuid } from "@/utils/uuid";
import { createSyncStorage } from "./syncStorage";

type ThemeType = (typeof themes)[number];
const maxRecentColors = 6;
const maxFavoriteColors = 6;

export type AppUserModelState = {
  id: string;
  type: ModelType;
  display: string;
  secureKeySet?: boolean;
  config?: Record<string, unknown>;
};

type AppSettingsState = {
  theme: ThemeType;
  userModels: AppUserModelState[];
  recentColors: RgbaColor[];
  favoriteColors: RgbaColor[];
};

const defaultState: AppSettingsState = {
  theme: "system",
  userModels: modelDefinitions
    .filter((model) => model.predefined)
    .map((model) => ({
      id: uuid(),
      type: model.type,
      display: model.defaultName,
    })),
  recentColors: [],
  favoriteColors: [],
};

type AppSettingsSlice = AppSettingsState & {
  setTheme: (theme: ThemeType) => void;
  addModel: (model: AppUserModelState) => void;
  updateModel: (id: string, model: Partial<AppUserModelState>) => void;
  removeModel: (id: string) => void;
  addFavoriteColor: (color: RgbaColor) => void;
  addRecentColor: (color: RgbaColor) => void;
};

export const settingsStoreCreator: StateCreator<AppSettingsSlice> = (set) => ({
  ...defaultState,
  setTheme: (theme) => set({ theme }),
  addModel: (model) => set((state) => ({ userModels: [...state.userModels, model] })),
  updateModel: (id, model) =>
    set((state) => ({
      userModels: state.userModels.map((existing) => (existing.id === id ? { ...existing, ...model } : existing)),
    })),
  removeModel: (id) =>
    set((state) => ({
      userModels: state.userModels.filter((m) => m.id !== id),
    })),
  addFavoriteColor: (color) =>
    set((state) => ({
      favoriteColors: takeFirst(
        [color, ...state.favoriteColors.filter((c) => !areColorsEqual(c, color))],
        maxFavoriteColors,
      ),
    })),
  addRecentColor: (color) =>
    set((state) => ({
      recentColors: takeFirst([color, ...state.recentColors.filter((c) => !areColorsEqual(c, color))], maxRecentColors),
    })),
});

export const useSettingsStore = create<AppSettingsSlice>()(
  persist(settingsStoreCreator, createSyncStorage({ version: 6, name: "settings" })),
);
