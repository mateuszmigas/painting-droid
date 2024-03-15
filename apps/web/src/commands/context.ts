import type { DialogService } from "@/components/dialogHost";
import type {
  useWorkspacesStore,
  useCommandPaletteStore,
  useLayoutStore,
} from "@/store";

export type CommandContext = {
  stores: {
    workspaces: () => ReturnType<typeof useWorkspacesStore.getState>;
    commandPalette: () => ReturnType<typeof useCommandPaletteStore.getState>;
    layout: () => ReturnType<typeof useLayoutStore.getState>;
  };
  dialogService: DialogService;
};
