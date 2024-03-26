import { AppHeaderBar } from "@/components/main/appHeaderBar";
import { AppStatusBar } from "@/components/main/appStatusBar";
import { AppContent } from "@/components/main/appContent";
import { useSyncTheme } from "./hooks/useSyncTheme";
import { CommandPaletteHost } from "./components/commandPaletteHost";
import { DialogHost } from "./components/dialogHost";
import { useIdleCallback } from "./hooks";
import { coreClient } from "./wasm/core/coreClient";
import {
  CanvasContextStoreContext,
  canvasContextStore,
} from "./contexts/canvasContextService";

export const App = () => {
  useSyncTheme();
  useIdleCallback(() => {
    coreClient.init();
  });

  return (
    <div className="size-full flex flex-col select-none">
      <DialogHost>
        <CommandPaletteHost>
          <CanvasContextStoreContext.Provider value={canvasContextStore}>
            <AppHeaderBar />
            <AppContent />
            <AppStatusBar />
          </CanvasContextStoreContext.Provider>
        </CommandPaletteHost>
      </DialogHost>
    </div>
  );
};
