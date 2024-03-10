import { AppHeaderBar } from "@/components/main/appHeaderBar";
import { AppStatusBar } from "@/components/main/appStatusBar";
import { AppContent } from "@/components/main/appContent";
import { useSyncTheme } from "./hooks/useSyncTheme";
import { CommandPalette } from "./components/commandPalette";

export const App = () => {
  useSyncTheme();
  return (
    <div className="size-full flex flex-col select-none">
      <CommandPalette />
      <AppHeaderBar />
      <AppContent />
      <AppStatusBar />
    </div>
  );
};

