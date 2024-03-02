import { AppMenuBar } from "@/components/appMenuBar";
import { AppStatusBar } from "@/components/appStatusBar";
import { AppContent } from "@/components/appContent";
import { useSyncTheme } from "./hooks/useSyncTheme";

export const App = () => {
  useSyncTheme();
  return (
    <div className="w-full h-full flex flex-col">
      <AppMenuBar></AppMenuBar>
      <AppContent></AppContent>
      <AppStatusBar></AppStatusBar>
    </div>
  );
};
