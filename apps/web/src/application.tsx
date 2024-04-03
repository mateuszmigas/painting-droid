import { AppHeaderBar } from "@/components/main/appHeaderBar";
import { AppStatusBar } from "@/components/main/appStatusBar";
import { AppContent } from "@/components/main/appContent";
import { useSyncTheme } from "./hooks/useSyncTheme";
import {
  CommandPaletteHost,
  type CommandService,
} from "./components/commandPaletteHost";
import { DialogHost, type DialogService } from "./components/dialogHost";
import { useHasStoreHydrated, useIdleCallback } from "./hooks";
import { coreClient } from "./wasm/core/coreClient";
import { CanvasPreviewContextStoreContext } from "./contexts/canvasPreviewContextStore";
import type { CanvasContext } from "./utils/common";
import { useState } from "react";
import { DialogServiceContext } from "./contexts/dialogService";
import { CommandServiceContext } from "./contexts/commandService";
import { useWorkspacesStore } from "./store";

export const App = () => {
  const hasStoreHydrated = useHasStoreHydrated(useWorkspacesStore);

  const [previewContext, setPreviewContext] = useState<CanvasContext | null>(
    null
  );
  const [dialogService, setDialogService] = useState<DialogService | null>(
    null
  );
  const [commandService, setCommandService] = useState<CommandService | null>(
    null
  );

  useSyncTheme();
  useIdleCallback(() => {
    coreClient.init();
  });

  if (!hasStoreHydrated) {
    return null;
  }

  return (
    <div className="size-full flex flex-col select-none">
      <CanvasPreviewContextStoreContext.Provider
        value={{ previewContext, setPreviewContext }}
      >
        <DialogServiceContext.Provider value={dialogService!}>
          <CommandServiceContext.Provider value={commandService!}>
            <DialogHost setDialogService={setDialogService} />
            <CommandPaletteHost setCommandService={setCommandService} />
            {commandService && dialogService && (
              <>
                <AppHeaderBar />
                <AppContent />
                <AppStatusBar />
              </>
            )}
          </CommandServiceContext.Provider>
        </DialogServiceContext.Provider>
      </CanvasPreviewContextStoreContext.Provider>
    </div>
  );
};
