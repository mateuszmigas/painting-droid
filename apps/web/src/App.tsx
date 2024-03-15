import { AppHeaderBar } from "@/components/main/appHeaderBar";
import { AppStatusBar } from "@/components/main/appStatusBar";
import { AppContent } from "@/components/main/appContent";
import { useSyncTheme } from "./hooks/useSyncTheme";
import { CommandPaletteHost } from "./components/commandPaletteHost";
import { DialogHost } from "./components/dialogHost";
import { canvasActionDispatcher } from "./canvas/canvasActionDispatcher";
import { useWorkspacesStore } from "./store";
import { activeWorkspaceSelector } from "./store/workspacesStore";

//todo, more performant way to access workspace
canvasActionDispatcher.attachExternalStore({
  getState: () =>
    activeWorkspaceSelector(useWorkspacesStore.getState()).canvasData,
  setState: (state) => useWorkspacesStore.getState().setCanvasData(state),
});

export const App = () => {
  useSyncTheme();

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
