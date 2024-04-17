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
};

export const settingsStoreCreator: StateCreator<AppSettingsSlice> = (set) => ({
  ...defaultState,
  setTheme: (theme) => set({ theme }),
});

export const useSettingsStore = create<AppSettingsSlice>()(
  persist(
    settingsStoreCreator,
    createSyncStorage({ version: 4, name: "settings" })
  )
);

