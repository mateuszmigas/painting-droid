import { getTranslations } from "@/translations";
import { memo, useState } from "react";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Droid } from "../../droid";
import { Typewriter } from "../../typewriter";
import { Button } from "@/components/ui/button";
import { WelcomePage } from "./pages/welcomePage";
import { ThemesPage } from "./pages/themesPage";
import { ModelsPage } from "./pages/modelsPage";

const dialogTranslations = getTranslations().dialogs.welcome;

const pages = ["welcome", "theme", "models"] as const;

export const WelcomeDialog = memo((props: { close: () => void }) => {
  const [pageIndex, setPageIndex] = useState<number>(2);

  return (
    <DialogContent style={{ minWidth: "350px", maxWidth: "600px" }}>
      <DialogHeader>
        <DialogTitle>{dialogTranslations.title}</DialogTitle>
      </DialogHeader>
      {pages[pageIndex] === "welcome" && <WelcomePage></WelcomePage>}
      {pages[pageIndex] === "theme" && <ThemesPage></ThemesPage>}
      {pages[pageIndex] === "models" && <ModelsPage></ModelsPage>}
      <div
        className={`gap-medium flex flex-row ${
          pageIndex === 0 ? "justify-end" : "justify-between"
        }`}
      >
        {pageIndex > 0 && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPageIndex(pageIndex - 1)}
          >
            Previous
          </Button>
        )}
        {pageIndex < pages.length - 1 ? (
          <Button
            className="place-self-end"
            type="button"
            onClick={() => setPageIndex(pageIndex + 1)}
          >
            Next
          </Button>
        ) : (
          <Button type="button" onClick={props.close}>
            Close
          </Button>
        )}
      </div>
    </DialogContent>
  );
});

