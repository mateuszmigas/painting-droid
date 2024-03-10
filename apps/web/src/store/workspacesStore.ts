import { uuid } from "@/utils/uuid";
import { create, type StateCreator } from "zustand";

export type WorkspaceId = string;
export type LayerId = string;

export type Layer = {
  id: LayerId;
  name: string;
  visible: boolean;
  locked: boolean;
};

export type Workspace = {
  id: WorkspaceId;
  name: string;
  filePath: string | null;
  isSaved: boolean;
  selectedLayerId: string;
  layers: Layer[];
};

export type AppWorkspacesState = {
  workspaces: Workspace[];
  selectedWorkspaceId: WorkspaceId;
};

const defaultLayer: Layer = {
  id: uuid(),
  name: "Background",
  visible: true,
  locked: false,
};

const defaultWorkspace: Workspace = {
  id: uuid(),
  name: "Untitled",
  filePath: null,
  isSaved: false,
  selectedLayerId: defaultLayer.id,
  layers: [defaultLayer],
};

const defaultState: AppWorkspacesState = {
  workspaces: [defaultWorkspace],
  selectedWorkspaceId: defaultWorkspace.id,
};

type AppWorkspacesSlice = AppWorkspacesState & {
  selectWorkspace: (workspaceId: WorkspaceId) => void;
  addNewActiveWorkspace: () => void;
  selectLayer: (layerId: LayerId) => void;
  addLayer: () => void;
  removeLayer: (layerId: LayerId) => void;
  duplicateLayer: (layerId: LayerId) => void;
  moveLayerUp: (layerId: LayerId) => void;
  moveLayerDown: (layerId: LayerId) => void;
  lockLayer: (layerId: LayerId) => void;
  unlockLayer: (layerId: LayerId) => void;
  showLayer: (layerId: LayerId) => void;
  hideLayer: (layerId: LayerId) => void;

  // mergeLayerUp: (workspaceId: string, layerId: string) => void;
  // mergeLayerDown: (workspaceId: string, layerId: string) => void;
};

export const forSelectedWorkspace = (
  state: AppWorkspacesState,
  map: (workspace: Workspace) => Workspace
) => {
  const selectedWorkspace = state.selectedWorkspaceId;
  return {
    ...state,
    workspaces: state.workspaces.map((workspace) =>
      workspace.id === selectedWorkspace ? map(workspace) : workspace
    ),
  };
};

export const workspacesStoreCreator: StateCreator<AppWorkspacesSlice> = (
  set
) => ({
  ...defaultState,
  selectWorkspace: (id) => set({ selectedWorkspaceId: id }),
  addNewActiveWorkspace: () => {
    const newId = uuid();
    return set((state) => ({
      ...state,
      workspaces: [...state.workspaces, { ...defaultWorkspace, id: newId }],
      selectedWorkspaceId: newId,
    }));
  },
  selectLayer: (layerId: LayerId) => {
    return set((state) =>
      forSelectedWorkspace(state, (workspace) => ({
        ...workspace,
        selectedLayerId: layerId,
      }))
    );
  },
  addLayer: () => {
    const newLayerId = uuid();
    return set((state) =>
      forSelectedWorkspace(state, (workspace) => ({
        ...workspace,
        selectedLayerId: newLayerId,
        layers: [
          {
            ...defaultLayer,
            id: newLayerId,
            name: `Layer ${workspace.layers.length + 1}`,
          },
          ...workspace.layers,
        ],
      }))
    );
  },
  removeLayer: (layerId: LayerId) => {
    return set((state) =>
      forSelectedWorkspace(state, (workspace) => {
        if (workspace.layers.length === 1) return workspace;
        const newLayers = workspace.layers.filter(
          (layer) => layer.id !== layerId
        );
        return {
          ...workspace,
          layers: newLayers,
          selectedLayerId:
            layerId === workspace.selectedLayerId
              ? newLayers[0].id
              : workspace.selectedLayerId,
        };
      })
    );
  },
  duplicateLayer: (layerId: LayerId) => {
    const newLayerId = uuid();
    return set((state) =>
      forSelectedWorkspace(state, (workspace) => {
        const index = workspace.layers.findIndex(
          (layer) => layer.id === layerId
        );
        const newLayers = [...workspace.layers];
        newLayers.splice(index + 1, 0, {
          ...newLayers[index],
          id: newLayerId,
          name: `${newLayers[index].name} copy`,
        });
        return {
          ...workspace,
          layers: newLayers,
          selectedLayerId: newLayerId,
        };
      })
    );
  },
  moveLayerUp: (layerId: LayerId) => {
    return set((state) =>
      forSelectedWorkspace(state, (workspace) => {
        const index = workspace.layers.findIndex(
          (layer) => layer.id === layerId
        );
        if (index === 0) return workspace;
        const newLayers = [...workspace.layers];
        [newLayers[index], newLayers[index - 1]] = [
          newLayers[index - 1],
          newLayers[index],
        ];
        return { ...workspace, layers: newLayers };
      })
    );
  },
  moveLayerDown: (layerId: LayerId) => {
    return set((state) =>
      forSelectedWorkspace(state, (workspace) => {
        const index = workspace.layers.findIndex(
          (layer) => layer.id === layerId
        );
        if (index === workspace.layers.length - 1) return workspace;
        const newLayers = [...workspace.layers];
        [newLayers[index], newLayers[index + 1]] = [
          newLayers[index + 1],
          newLayers[index],
        ];
        return { ...workspace, layers: newLayers };
      })
    );
  },
  lockLayer: (layerId: LayerId) => {
    return set((state) =>
      forSelectedWorkspace(state, (workspace) => {
        const newLayers = workspace.layers.map((layer) =>
          layer.id === layerId ? { ...layer, locked: true } : layer
        );
        return { ...workspace, layers: newLayers };
      })
    );
  },
  unlockLayer: (layerId: LayerId) => {
    return set((state) =>
      forSelectedWorkspace(state, (workspace) => {
        const newLayers = workspace.layers.map((layer) =>
          layer.id === layerId ? { ...layer, locked: false } : layer
        );
        return { ...workspace, layers: newLayers };
      })
    );
  },
  showLayer: (layerId: LayerId) => {
    return set((state) =>
      forSelectedWorkspace(state, (workspace) => {
        const newLayers = workspace.layers.map((layer) =>
          layer.id === layerId ? { ...layer, visible: true } : layer
        );
        return { ...workspace, layers: newLayers };
      })
    );
  },
  hideLayer: (layerId: LayerId) => {
    return set((state) =>
      forSelectedWorkspace(state, (workspace) => {
        const newLayers = workspace.layers.map((layer) =>
          layer.id === layerId ? { ...layer, visible: false } : layer
        );
        return { ...workspace, layers: newLayers };
      })
    );
  },
});

export const useWorkspacesStore = create<AppWorkspacesSlice>(
  workspacesStoreCreator
);

