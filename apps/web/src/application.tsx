import { useState } from "react";
import { AppContent } from "@/components/main/appContent";
import { AppHeaderBar } from "@/components/main/appHeaderBar";
import { AppStatusBar } from "@/components/main/appStatusBar";
import { Toaster } from "@/components/ui/sonner";
import { AlertHost, type AlertService } from "./components/alertHost";
import { CommandPaletteHost, type CommandService } from "./components/commandPaletteHost";
import { DialogHost, type DialogService } from "./components/dialogHost";
import { DropFileContainer } from "./components/drop-file/dropFileContainer";
import { AlertServiceContext } from "./contexts/alertService";
import { CanvasPreviewContextStoreContext } from "./contexts/canvasContextStore";
import { CommandServiceContext } from "./contexts/commandService";
import { DialogServiceContext } from "./contexts/dialogService";
import { NotificationServiceContext, notificationService } from "./contexts/notificationService";
import { useDragWatcher, useHasStoreHydrated, useIdleCallback } from "./hooks";
import { useSyncTheme } from "./hooks/useSyncTheme";
import { useWorkspacesStore } from "./store";
import type { CanvasBitmapContext, CanvasVectorContext } from "./utils/common";
import { windowHandle } from "./utils/window-handle";
import { coreClient } from "./wasm/core/coreClient";

export const Application = () => {
  const hasStoreHydrated = useHasStoreHydrated(useWorkspacesStore);

  const [rasterContext, setBitmapContext] = useState<CanvasBitmapContext | null>(null);
  const [vectorContext, setVectorContext] = useState<CanvasVectorContext | null>(null);

  const [dialogService, setDialogService] = useState<DialogService | null>(null);
  const [alertService, setAlertService] = useState<AlertService | null>(null);
  const [commandService, setCommandService] = useState<CommandService | null>(null);
  const [isDragging, dragHandlers] = useDragWatcher();

  useSyncTheme();
  useIdleCallback(() => {
    coreClient.init();
    windowHandle.showWindow();
  });

  if (!hasStoreHydrated) {
    return null;
  }

  return (
    <div {...dragHandlers} className="size-full flex flex-col select-none">
      <CanvasPreviewContextStoreContext.Provider
        value={{
          context: { bitmap: rasterContext, vector: vectorContext },
          setBitmapContext,
          setVectorContext,
        }}
      >
        <AlertServiceContext.Provider value={alertService!}>
          <NotificationServiceContext.Provider value={notificationService}>
            <DialogServiceContext.Provider value={dialogService!}>
              <CommandServiceContext.Provider value={commandService!}>
                <DialogHost setDialogService={setDialogService} />
                <AlertHost setAlertService={setAlertService} />
                <CommandPaletteHost setCommandService={setCommandService} />
                {commandService && dialogService && (
                  <>
                    <AppHeaderBar />
                    <AppContent />
                    <AppStatusBar />
                    {isDragging && <DropFileContainer className="absolute size-full z-10" />}
                    <Toaster closeButton />
                  </>
                )}
              </CommandServiceContext.Provider>
            </DialogServiceContext.Provider>
          </NotificationServiceContext.Provider>
        </AlertServiceContext.Provider>
      </CanvasPreviewContextStoreContext.Provider>
    </div>
  );
};
