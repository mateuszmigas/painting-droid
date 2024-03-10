import { create, type StateCreator } from "zustand";

type AppCommandPaletteState = {
  isOpen: boolean;
};

const defaultState: AppCommandPaletteState = {
  isOpen: false,
};

type AppCommandPaletteSlice = AppCommandPaletteState & {
  setIsOpen: (isOpen: boolean) => void;
};

export const commandPaletteStoreCreator: StateCreator<AppCommandPaletteSlice> = (set) => ({
  ...defaultState,
  setIsOpen: (isOpen) => set({ isOpen }),
});

export const useCommandPaletteStore = create<AppCommandPaletteSlice>(commandPaletteStoreCreator);
