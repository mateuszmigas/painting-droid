import { uuid } from "@/utils/uuid";
import { create, type StateCreator } from "zustand";

type Workspace = {
  id: string;
  name: string;
  filePath: string | null;
  isSaved: boolean;
};

export type AppWorkspacesState = {
  workspaces: Workspace[];
  selectedWorkspaceId: string;
};

const defaultWorkspace = {
  id: uuid(),
  name: "Untitled",
  filePath: null,
  isSaved: false,
};
const defaultState: AppWorkspacesState = {
  workspaces: [defaultWorkspace],
  selectedWorkspaceId: defaultWorkspace.id,
};

type AppWorkspacesSlice = AppWorkspacesState & {
  selectWorkspace: (id: string) => void;
  addNewActiveWorkspace: () => void;
};

export const workspacesStoreCreator: StateCreator<AppWorkspacesSlice> = (
  set,
  get
) => ({
  ...defaultState,
  selectWorkspace: (id) => set({ selectedWorkspaceId: id }),
  addNewActiveWorkspace: () => {
    const newId = uuid();
    return set((state) => ({
      ...state,
      workspaces: [
        ...state.workspaces,
        {
          id: newId,
          name: `Workspace ${get().workspaces.length + 1}`,
          filePath: null,
          isSaved: false,
        },
      ],
      selectedWorkspaceId: newId,
    }));
  },
});

export const useWorkspacesStore = create<AppWorkspacesSlice>(
  workspacesStoreCreator
);

