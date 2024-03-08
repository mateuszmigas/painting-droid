import { useWorkspacesStore } from "@/store";

export type CommandContext = {
  stores: {
    workspaces: () => ReturnType<typeof useWorkspacesStore.getState>;
  };
};

export const createContext = (): CommandContext => ({
  stores: {
    workspaces: () => useWorkspacesStore.getState(),
  },
});

