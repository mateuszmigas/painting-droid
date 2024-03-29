import { defaultCanvasState, type CanvasState } from "@/canvas/canvasState";
import type { Size } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";
import { uuid } from "@/utils/uuid";
import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getTranslations } from "@/translations";
import type { AdjustmentId } from "@/adjustments";

const translations = getTranslations();

export type WorkspacePopup = {
  type: "adjustments";
  adjustmentId: AdjustmentId;
  settings: Record<string, unknown>;
};

export type WorkspaceId = string;
export type Workspace = {
  id: WorkspaceId;
  name: string;
  filePath: string | null;
  size: Size;
  viewport: Viewport | null;
  popup: WorkspacePopup | null;
  canvasData: CanvasState;
};

export type AppWorkspacesState = {
  workspaces: Workspace[];
  activeWorkspaceId: WorkspaceId;
};

const defaultWorkspace: Workspace = {
  id: uuid(),
  name: translations.workspace.defaultName,
  filePath: null,
  size: { width: 800, height: 600 },
  viewport: null,
  popup: null,
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
  openApplyPopup: (type: WorkspacePopup) => void;
  closeApplyPopup: () => void;
  updatePopupSettings: (settings: Record<string, unknown>) => void;
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
  selectWorkspace: (id) =>
    set((state) => ({
      activeWorkspaceId: id,
      workspaces: state.workspaces.map((workspace) => ({
        ...workspace,
        popup: null,
      })),
    })),
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
  openApplyPopup: (type: WorkspacePopup) =>
    set((state) =>
      mapActiveWorkspace(state, (workspace) => ({
        ...workspace,
        popup: type,
      }))
    ),
  closeApplyPopup: () =>
    set((state) =>
      mapActiveWorkspace(state, (workspace) => ({
        ...workspace,
        popup: null,
      }))
    ),
  updatePopupSettings: (settings) =>
    set((state) =>
      mapActiveWorkspace(state, (workspace) => ({
        ...workspace,
        popup: workspace.popup
          ? { ...workspace.popup, settings }
          : workspace.popup,
      }))
    ),
});

export const useWorkspacesStore = create<AppWorkspacesSlice>()(
  persist(workspacesStoreCreator, {
    version: 8,
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

export const activeWorkspaceActiveLayerSelector = (
  state: AppWorkspacesState
) => {
  const { layers, activeLayerIndex } = activeWorkspaceCanvasDataSelector(state);
  return layers[activeLayerIndex];
};
