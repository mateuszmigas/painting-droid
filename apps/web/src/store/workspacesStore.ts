import { defaultCanvasState, type CanvasState } from "@/canvas/canvasState";
import type { Size } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";
import { uuid } from "@/utils/uuid";
import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type WorkspaceId = string;
export type Workspace = {
  id: WorkspaceId;
  name: string;
  filePath: string | null;
  size: Size;
  viewport: Viewport | null;
  canvasData: CanvasState;
};

export type AppWorkspacesState = {
  workspaces: Workspace[];
  activeWorkspaceId: WorkspaceId;
};

const defaultWorkspace: Workspace = {
  id: uuid(),
  name: "Untitled",
  filePath: null,
  size: { width: 800, height: 600 },
  viewport: null,
  canvasData: defaultCanvasState,
};

const defaultState: AppWorkspacesState = {
  workspaces: [defaultWorkspace],
  activeWorkspaceId: defaultWorkspace.id,
};

type AppWorkspacesSlice = AppWorkspacesState & {
  selectWorkspace: (workspaceId: WorkspaceId) => void;
  closeWorkspace: (workspaceId: WorkspaceId) => void;
  clearWorkspace: (workspaceId: WorkspaceId) => void;
  setWorkspaceViewport: (viewport: Viewport) => void;
  addNewActiveWorkspace: (size: Size) => void;
  loadWorkspace: (name: string, size: Size, canvasData: CanvasState) => void;
  setCanvasData: (canvasData: CanvasState) => void;
};

export const mapActiveWorkspace = (
  state: AppWorkspacesState,
  map: (workspace: Workspace) => Workspace
) => {
  const activeWorkspace = state.activeWorkspaceId;
  return {
    ...state,
    workspaces: state.workspaces.map((workspace) =>
      workspace.id === activeWorkspace ? map(workspace) : workspace
    ),
  };
};

export const workspacesStoreCreator: StateCreator<AppWorkspacesSlice> = (
  set
) => ({
  ...defaultState,
  selectWorkspace: (id) => set({ activeWorkspaceId: id }),
  closeWorkspace: (id) =>
    set((state) => {
      if (state.workspaces.length === 1) {
        return state;
      }
      const workspaces = state.workspaces.filter((w) => w.id !== id);
      return {
        ...state,
        workspaces,
        activeWorkspaceId:
          state.activeWorkspaceId === id
            ? workspaces[0].id
            : state.activeWorkspaceId,
      };
    }),
  clearWorkspace: (id) =>
    set((state) => {
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === id ? { ...w, canvasData: defaultCanvasState } : w
        ),
      };
    }),
  setWorkspaceViewport: (viewport) =>
    set((state) =>
      mapActiveWorkspace(state, (workspace) => ({
        ...workspace,
        viewport,
      }))
    ),
  addNewActiveWorkspace: (size: Size) => {
    const newId = uuid();
    return set((state) => ({
      ...state,
      workspaces: [
        ...state.workspaces,
        {
          ...defaultWorkspace,
          id: newId,
          name: `Untitled ${state.workspaces.length + 1}`,
          size,
        },
      ],
      activeWorkspaceId: newId,
    }));
  },
  loadWorkspace: (name, size, canvasData) => {
    const newId = uuid();
    return set((state) => ({
      ...state,
      workspaces: [
        ...state.workspaces,
        {
          ...defaultWorkspace,
          id: newId,
          name,
          size,
          canvasData,
        },
      ],
      activeWorkspaceId: newId,
    }));
  },
  setCanvasData: (canvasData) =>
    set((state) =>
      mapActiveWorkspace(state, (workspace) => ({
        ...workspace,
        canvasData,
      }))
    ),
});

export const useWorkspacesStore = create<AppWorkspacesSlice>()(
  persist(workspacesStoreCreator, {
    version: 7,
    name: "workspaces",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      ...state,
      workspaces: state.workspaces.map((workspace) => ({
        ...workspace,
        canvasData: {
          ...workspace.canvasData,
          history: [],
        },
      })),
    }),
  })
);

export const activeWorkspaceSelector = (state: AppWorkspacesState) => {
  return state.workspaces.find((w) => w.id === state.activeWorkspaceId)!;
};

export const activeWorkspaceCanvasDataSelector = (
  state: AppWorkspacesState
) => {
  return state.workspaces.find((w) => w.id === state.activeWorkspaceId)!
    .canvasData;
};
