import { getTranslations } from "@/translations";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { WelcomePage } from "./pages/welcomePage";
import { ThemesPage } from "./pages/themesPage";
import { ModelsPage } from "./pages/modelsPage";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const translations = getTranslations();
const dialogTranslations = translations.dialogs.welcome;

const pages = ["welcome", "theme", "models"] as const;

export const WelcomeDialog = memo((props: { close: () => void }) => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const page = pages[pageIndex];

  return (
    <DialogContent style={{ minWidth: "350px", maxWidth: "600px" }}>
      <DialogHeader>
        <DialogTitle>{dialogTranslations.pages[page].title}</DialogTitle>
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
            {translations.general.previous}
          </Button>
        )}
        {pageIndex < pages.length - 1 ? (
          <Button
            className="place-self-end"
            type="button"
            onClick={() => setPageIndex(pageIndex + 1)}
          >
            {translations.general.next}
          </Button>
        ) : (
          <Button type="button" onClick={props.close}>
            {translations.general.close}
          </Button>
        )}
      </div>
    </DialogContent>
  );
});
