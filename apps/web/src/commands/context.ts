import {
  useCommandPaletteStore,
  useLayoutStore,
  useWorkspacesStore,
} from "@/store";

export type CommandContext = {
  stores: {
    workspaces: () => ReturnType<typeof useWorkspacesStore.getState>;
    commandPalette: () => ReturnType<typeof useCommandPaletteStore.getState>;
    layout: () => ReturnType<typeof useLayoutStore.getState>;
  };
  // services
};

export const createContext = (): CommandContext => ({
  stores: {
    workspaces: () => useWorkspacesStore.getState(),
    commandPalette: () => useCommandPaletteStore.getState(),
    layout: () => useLayoutStore.getState(),
  },
});
