import { AppHeaderBar } from "@/components/appHeaderBar";
import { AppStatusBar } from "@/components/appStatusBar";
import { AppContent } from "@/components/appContent";
import { useSyncTheme } from "./hooks/useSyncTheme";

export const App = () => {
  useSyncTheme();
  return (
    <div className="w-full h-full flex flex-col">
      <AppHeaderBar></AppHeaderBar>
      <AppContent></AppContent>
      <AppStatusBar></AppStatusBar>
    </div>
  );
};
