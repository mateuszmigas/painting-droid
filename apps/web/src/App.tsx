import { AppMenuBar } from "@/components/appMenuBar";
import { ThemeProvider } from "@/lib/themeProvider";
import { AppStatusBar } from "@/components/appStatusBar";
import { AppContent } from "@/components/appContent";

export const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-full h-full flex flex-col">
        <AppMenuBar></AppMenuBar>
        <AppContent></AppContent>
        <AppStatusBar></AppStatusBar>
      </div>
    </ThemeProvider>
  );
};
