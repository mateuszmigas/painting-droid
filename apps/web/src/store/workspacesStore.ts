import { create, type StateCreator } from "zustand";

type Workspace = {
  name: string;
  filePath: string | null;
  isSaved: boolean;
};

type AppWorkspacesState = {
  workspaces: Workspace[];
  selectedWorkspaceIndex: number | null;
};

const defaultState: AppWorkspacesState = {
  workspaces: [
    {
      name: "Untitled",
      filePath: null,
      isSaved: false,
    },
  ],
  selectedWorkspaceIndex: 0,
};

type AppWorkspacesSlice = AppWorkspacesState & {
  selectWorkspace: (index: number) => void;
};

export const settingsStoreCreator: StateCreator<AppWorkspacesSlice> = (
  set
) => ({
  ...defaultState,
  selectWorkspace: (index) => set({ selectedWorkspaceIndex: index }),
});

export const useWorkspacesStore =
  create<AppWorkspacesSlice>(settingsStoreCreator);

