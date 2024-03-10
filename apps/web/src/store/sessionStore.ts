import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AppSessionState = {
  name: string;
};

const defaultState: AppSessionState = {
  name: "painting-droid",
};

type AppSessionSlice = AppSessionState & {
  setName: (name: string) => void;
};

export const settingsStoreCreator: StateCreator<AppSessionSlice> = (set) => ({
  ...defaultState,
  setName: (name: string) => set({ name }),
});

export const useSessionStore = create<AppSessionSlice>()(
  persist(settingsStoreCreator, {
    version: 1,
    name: "session",
    storage: createJSONStorage(() => sessionStorage),
  }),
);
