import { AppHeaderBar } from "@/components/main/appHeaderBar";
import { AppStatusBar } from "@/components/main/appStatusBar";
import { AppContent } from "@/components/main/appContent";
import { useSyncTheme } from "./hooks/useSyncTheme";
import { CommandPaletteHost } from "./components/commandPaletteHost";
import { DialogHost } from "./components/dialogHost";
import { useIdleCallback } from "./hooks";
import { coreClient } from "./wasm/core/coreClient";
import { CanvasContextStoreContext } from "./contexts/canvasContextService";
import type { CanvasContext } from "./utils/common";
import { useState } from "react";

export const App = () => {
  const [activeCanvasContext, setActiveCanvasContext] =
    useState<CanvasContext | null>(null);

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
        <DialogHost>
          <CommandPaletteHost>
            <AppHeaderBar />
            <AppContent />
            <AppStatusBar />
          </CommandPaletteHost>
        </DialogHost>
      </CanvasContextStoreContext.Provider>
    </div>
  );
};
