import { AppHeaderBar } from "@/components/main/appHeaderBar";
import { AppStatusBar } from "@/components/main/appStatusBar";
import { AppContent } from "@/components/main/appContent";
import { useSyncTheme } from "./hooks/useSyncTheme";
import {
  CommandPaletteHost,
  type CommandService,
} from "./components/commandPaletteHost";
import { DialogHost, type DialogService } from "./components/dialogHost";
import { useIdleCallback } from "./hooks";
import { coreClient } from "./wasm/core/coreClient";
import { CanvasContextStoreContext } from "./contexts/canvasContextService";
import type { CanvasContext } from "./utils/common";
import { useState } from "react";
import { DialogServiceContext } from "./contexts/dialogService";
import { CommandServiceContext } from "./contexts/commandService";

export const App = () => {
  const [activeCanvasContext, setActiveCanvasContext] =
    useState<CanvasContext | null>(null);
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

  return (
    <div className="size-full flex flex-col select-none">
      <CanvasContextStoreContext.Provider
        value={{
          activeContext: activeCanvasContext,
          setActiveContext: setActiveCanvasContext,
        }}
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
      </CanvasContextStoreContext.Provider>
    </div>
  );
};
