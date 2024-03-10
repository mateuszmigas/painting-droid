import { useCommandPaletteStore, useWorkspacesStore } from "@/store";

export type CommandContext = {
  stores: {
    workspaces: () => ReturnType<typeof useWorkspacesStore.getState>;
    commandPalette: () => ReturnType<typeof useCommandPaletteStore.getState>;
  };
};

export const createContext = (): CommandContext => ({
  stores: {
    workspaces: () => useWorkspacesStore.getState(),
    commandPalette: () => useCommandPaletteStore.getState(),
  },
});
