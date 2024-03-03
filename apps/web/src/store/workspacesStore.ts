import { uuid } from "@/utils/uuid";
import { create, type StateCreator } from "zustand";

type Workspace = {
  id: string;
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
      id: uuid(),
      name: "Untitled",
      filePath: null,
      isSaved: false,
    },
  ],
  selectedWorkspaceIndex: 0,
};

type AppWorkspacesSlice = AppWorkspacesState & {
  selectWorkspace: (index: number) => void;
  addWorkspace: () => void;
};

export const settingsStoreCreator: StateCreator<AppWorkspacesSlice> = (
  set,
  get
) => ({
  ...defaultState,
  selectWorkspace: (index) => set({ selectedWorkspaceIndex: index }),
  addWorkspace: () =>
    set((state) => ({
      workspaces: [
        ...state.workspaces,
        {
          id: uuid(),
          name: `Workspace ${get().workspaces.length + 1}`,
          filePath: null,
          isSaved: false,
        },
      ],
      selectedWorkspaceIndex: state.workspaces.length,
    })),
});

export const useWorkspacesStore =
  create<AppWorkspacesSlice>(settingsStoreCreator);

