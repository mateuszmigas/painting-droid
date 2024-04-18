import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { createSyncStorage } from "./syncStorage";
import { modelDefinitions, type ModelType } from "@/models/definitions";
import { uuid } from "@/utils/uuid";

type ThemeType = "light" | "dark" | "system";

export type AppUserModelState = {
  id: string;
  type: ModelType;
  display: string;
  secureKeySet?: boolean;
};

type AppSettingsState = {
  theme: ThemeType;
  userModels: AppUserModelState[];
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
};

type AppSettingsSlice = AppSettingsState & {
  setTheme: (theme: ThemeType) => void;
  addModel: (model: AppUserModelState) => void;
  updateModel: (id: string, model: Partial<AppUserModelState>) => void;
  removeModel: (id: string) => void;
};

export const settingsStoreCreator: StateCreator<AppSettingsSlice> = (set) => ({
  ...defaultState,
  setTheme: (theme) => set({ theme }),
  addModel: (model) =>
    set((state) => ({ userModels: [...state.userModels, model] })),
  updateModel: (id, model) =>
    set((state) => ({
      userModels: state.userModels.map((existing) =>
        existing.id === id ? { ...existing, ...model } : existing
      ),
    })),
  removeModel: (id) =>
    set((state) => ({
      userModels: state.userModels.filter((m) => m.id !== id),
    })),
});

export const useSettingsStore = create<AppSettingsSlice>()(
  persist(
    settingsStoreCreator,
    createSyncStorage({ version: 4, name: "settings" })
  )
);
