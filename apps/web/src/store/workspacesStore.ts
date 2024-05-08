import {
  createDefaultCanvasState,
  type CanvasState,
} from "@/canvas/canvasState";
import type { Size } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";
import { uuid } from "@/utils/uuid";
import { create, type StateCreator } from "zustand";
import { type PersistStorage, persist } from "zustand/middleware";
import { getTranslations } from "@/translations";
import type { AdjustmentId } from "@/adjustments";
import type { ImageCompressedData } from "@/utils/imageData";
import { blobsStorage } from "./blobsStorage";
import { workspace } from "@/constants";

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
  viewport: Viewport | null;
  popup: WorkspacePopup | null;
  canvasData: CanvasState;
};

export type AppWorkspacesState = {
  workspaces: Workspace[];
  activeWorkspaceId: WorkspaceId;
};

const createDefaultWorkspace = (size: Size): Workspace => ({
  id: uuid(),
  name: translations.workspace.defaultName,
  filePath: null,
  viewport: null,
  popup: null,
  canvasData: createDefaultCanvasState(size),
});

const defaultWorkspace = createDefaultWorkspace(workspace.defaultSize);
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
  createWorkspaceFromCanvasData: (
    name: string,
    canvasData: CanvasState
  ) => void;
  createWorkspaceFromImage: (
    name: string,
    size: Size,
    data: ImageCompressedData
  ) => void;
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
          w.id === id
            ? { ...w, canvasData: createDefaultCanvasState(w.canvasData.size) }
            : w
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
          ...createDefaultWorkspace(size),
          id: newId,
          name: `Untitled ${state.workspaces.length + 1}`,
        },
      ],
      activeWorkspaceId: newId,
    }));
  },
  createWorkspaceFromCanvasData: (name, canvasData) => {
    const newId = uuid();
    return set((state) => ({
      ...state,
      workspaces: [
        ...state.workspaces,
        {
          ...createDefaultWorkspace(canvasData.size),
          id: newId,
          name,
          canvasData,
        },
      ],
      activeWorkspaceId: newId,
    }));
  },
  createWorkspaceFromImage(name, size, data) {
    const newId = uuid();
    const workspace = createDefaultWorkspace(size);
    return set((state) => ({
      ...state,
      workspaces: [
        ...state.workspaces,
        {
          ...workspace,
          id: newId,
          name,
          canvasData: {
            ...workspace.canvasData,
            layers: [{ ...workspace.canvasData.layers[0], data }],
          },
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

const storage: PersistStorage<AppWorkspacesState> = {
  getItem: async (name) => {
    const value = localStorage.getItem(name);
    if (value) {
      const result = JSON.parse(value) as {
        state: AppWorkspacesState;
        version: number;
      };

      const blobs = await blobsStorage.getBlobs();

      const stateWithBlobs = {
        ...result.state,
        workspaces: result.state.workspaces.map((workspace) => ({
          ...workspace,
          canvasData: {
            ...workspace.canvasData,
            layers: workspace.canvasData.layers.map((layer) => ({
              ...layer,
              data: blobs.has(layer.id) ? blobs.get(layer.id) : null,
            })),
          },
        })),
      } as AppWorkspacesState;

      return {
        state: stateWithBlobs,
        version: result.version,
      };
    }

    return null;
  },
  setItem: async (name, value) => {
    const { state, version } = value;
    const blobs = state.workspaces
      .flatMap((w) => w.canvasData.layers)
      .filter((layer) => layer.data)
      .map((layer) => {
        return {
          key: layer.id,
          value: layer.data!,
        };
      });

    await blobsStorage.setBlobs(blobs);

    const stateWithoutBlobs = {
      ...state,
      workspaces: state.workspaces.map((workspace) => ({
        ...workspace,
        canvasData: {
          ...workspace.canvasData,
          capturedArea: null,
          layers: workspace.canvasData.layers.map((layer) => ({
            ...layer,
            data: null,
          })),
        },
      })),
    };

    localStorage.setItem(
      name,
      JSON.stringify({
        state: stateWithoutBlobs,
        version,
      })
    );
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useWorkspacesStore = create<AppWorkspacesSlice>()(
  persist(workspacesStoreCreator, {
    version: 15,
    name: "workspaces",
    storage,
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

