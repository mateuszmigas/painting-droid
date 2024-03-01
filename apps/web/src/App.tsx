import { AppMenuBar } from "@/components/appMenuBar";
import { ThemeProvider } from "@/lib/themeProvider";

export const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div>
        <AppMenuBar></AppMenuBar>
        <div className="p-2">
          <h1>Work in progress...</h1>
        </div>
      </div>
    </ThemeProvider>
  );
};
