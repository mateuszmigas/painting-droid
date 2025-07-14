import { create, type StateCreator } from "zustand";
import { type PersistStorage, persist } from "zustand/middleware";
import type { AdjustmentId } from "@/adjustments";
import { type CanvasState, createDefaultCanvasState } from "@/canvas/canvasState";
import { workspace } from "@/constants";
import { getTranslations } from "@/translations";
import type { RgbaColor } from "@/utils/color";
import type { Size } from "@/utils/common";
import type { ImageCompressedData } from "@/utils/imageData";
import type { Viewport } from "@/utils/manipulation";
import { uuid } from "@/utils/uuid";
import { blobsStorage } from "./blobsStorage";

const translations = getTranslations();

export type WorkspacePopup =
  | {
      type: "adjustments";
      adjustmentId: AdjustmentId;
      settings: Record<string, unknown>;
    }
  | { type: "chat" };

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
  addNewActiveWorkspace: (size: Size, name: string, baseColor: RgbaColor | null) => void;
  editWorkspace: (id: WorkspaceId, name: string, baseColor: RgbaColor | null) => void;
  createWorkspaceFromCanvasData: (name: string, canvasData: CanvasState) => void;
  createWorkspaceFromImage: (name: string, size: Size, data: ImageCompressedData) => void;
  setCanvasData: (canvasData: CanvasState) => void;
  openPopup: (type: WorkspacePopup) => void;
  closePopup: () => void;
  updatePopupSettings: (settings: Record<string, unknown>) => void;
};

export const mapActiveWorkspace = (state: AppWorkspacesState, map: (workspace: Workspace) => Workspace) => {
  const activeWorkspace = state.activeWorkspaceId;
  return {
    ...state,
    workspaces: state.workspaces.map((workspace) => (workspace.id === activeWorkspace ? map(workspace) : workspace)),
  };
};

export const workspacesStoreCreator: StateCreator<AppWorkspacesSlice> = (set) => ({
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
        activeWorkspaceId: state.activeWorkspaceId === id ? workspaces[0].id : state.activeWorkspaceId,
      };
    }),
  clearWorkspace: (id) =>
    set((state) => {
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === id ? { ...w, canvasData: createDefaultCanvasState(w.canvasData.size) } : w,
        ),
      };
    }),
  setWorkspaceViewport: (viewport) =>
    set((state) =>
      mapActiveWorkspace(state, (workspace) => ({
        ...workspace,
        viewport,
      })),
    ),
  addNewActiveWorkspace: (size: Size, name: string, baseColor: RgbaColor | null) => {
    const newId = uuid();
    return set((state) => ({
      ...state,
      workspaces: [
        ...state.workspaces,
        {
          ...createDefaultWorkspace(size),
          id: newId,
          name: name || translations.general.untitled,
          canvasData: createDefaultCanvasState(size, baseColor),
        },
      ],
      activeWorkspaceId: newId,
    }));
  },
  editWorkspace: (id: WorkspaceId, name: string, baseColor: RgbaColor | null) => {
    return set((state) => ({
      ...state,
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === id
          ? {
              ...workspace,
              name: name || translations.general.untitled,
              canvasData: {
                ...workspace.canvasData,
                baseColor,
              },
            }
          : workspace,
      ),
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
      })),
    ),
  openPopup: (type: WorkspacePopup) =>
    set((state) =>
      mapActiveWorkspace(state, (workspace) => ({
        ...workspace,
        popup: type,
      })),
    ),
  closePopup: () =>
    set((state) =>
      mapActiveWorkspace(state, (workspace) => ({
        ...workspace,
        popup: null,
      })),
    ),
  updatePopupSettings: (settings) =>
    set((state) =>
      mapActiveWorkspace(state, (workspace) => ({
        ...workspace,
        popup: workspace.popup ? { ...workspace.popup, settings } : workspace.popup,
      })),
    ),
});

const blobKeyPrefix = "__blob__";
const storage: PersistStorage<AppWorkspacesState> = {
  getItem: async (name) => {
    const value = localStorage.getItem(name);
    if (value) {
      const blobs = await blobsStorage.getBlobs();
      const result: {
        state: AppWorkspacesState;
        version: number;
      } = JSON.parse(value, (_, value) => {
        if (typeof value === "string" && value.startsWith(blobKeyPrefix)) {
          const id = value.replace(blobKeyPrefix, "");
          return blobs.get(id) ?? null;
        }
        return value;
      });

      return result;
    }

    return null;
  },
  setItem: async (name, value) => {
    const { state, version } = value;
    const blobs: { key: string; value: Blob }[] = [];
    const serialized = JSON.stringify({ state, version }, (_, value) => {
      if (value instanceof Blob) {
        const id = uuid();
        const blobKey = `${blobKeyPrefix}${id}`;
        blobs.push({ key: id, value });
        return blobKey;
      }
      return value;
    });

    await blobsStorage.setBlobs(blobs);
    localStorage.setItem(name, serialized);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useWorkspacesStore = create<AppWorkspacesSlice>()(
  persist(workspacesStoreCreator, {
    version: 17,
    name: "workspaces",
    storage,
  }),
);

export const activeWorkspaceSelector = (state: AppWorkspacesState) => {
  return state.workspaces.find((w) => w.id === state.activeWorkspaceId)!;
};

export const activeWorkspaceCanvasDataSelector = (state: AppWorkspacesState) => {
  return state.workspaces.find((w) => w.id === state.activeWorkspaceId)!.canvasData;
};

export const activeLayerSelector = (state: CanvasState) => {
  const { layers, activeLayerIndex } = state;
  return layers[activeLayerIndex];
};

export const activeShapeSelector = (state: CanvasState) => {
  const { activeShapeId, shapes } = state;
  return activeShapeId ? shapes[activeShapeId] : null;
};

export const activeWorkspaceActiveLayerSelector = (state: AppWorkspacesState) => {
  const { layers, activeLayerIndex } = activeWorkspaceCanvasDataSelector(state);
  return layers[activeLayerIndex];
};
