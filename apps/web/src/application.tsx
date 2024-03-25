import { AppHeaderBar } from "@/components/main/appHeaderBar";
import { AppStatusBar } from "@/components/main/appStatusBar";
import { AppContent } from "@/components/main/appContent";
import { useSyncTheme } from "./hooks/useSyncTheme";
import { CommandPaletteHost } from "./components/commandPaletteHost";
import { DialogHost } from "./components/dialogHost";
import { useIdleCallback } from "./hooks";
import { coreClient } from "./wasm/core/coreClient";

export const App = () => {
  useSyncTheme();
  useIdleCallback(() => {
    coreClient.init();
  });

  return (
    <div className="size-full flex flex-col select-none">
      <DialogHost>
        <CommandPaletteHost>
          <AppHeaderBar />
          <AppContent />
          <AppStatusBar />
        </CommandPaletteHost>
      </DialogHost>
    </div>
  );
};
