import { create } from "zustand";
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

export const useSessionStore = create<AppSessionSlice>()(
  persist(
    (set) => ({
      ...defaultState,
      setName: (name: string) => set({ name }),
    }),
    {
      version: 1,
      name: "session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

