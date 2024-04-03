import type { CanvasActionDispatcher } from "@/canvas/canvasActionDispatcher";
import type { DialogService } from "@/components/dialogHost";
import type {
  useWorkspacesStore,
  useCommandPaletteStore,
  useLayoutStore,
  useToolStore,
} from "@/store";
import type { CanvasContext } from "@/utils/common";

export type CommandContext = {
  stores: {
    workspaces: () => ReturnType<typeof useWorkspacesStore.getState>;
    commandPalette: () => ReturnType<typeof useCommandPaletteStore.getState>;
    layout: () => ReturnType<typeof useLayoutStore.getState>;
    tool: () => ReturnType<typeof useToolStore.getState>;
  };
  getActiveCanvasContext: () => CanvasContext | null;
  dialogService: DialogService;
  canvasActionDispatcher: CanvasActionDispatcher;
};
