import { getTranslations } from "@/translations";
import { memo, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Droid } from "./droid";

const dialogTranslations = getTranslations().dialogs.welcome;

type WelcomeTab = "general" | "models";

export const WelcomeDialog = memo((props: { close: () => void }) => {
  const [selectedTab, setSelectedTab] = useState<WelcomeTab>("general");

  return (
    <DialogContent style={{ minWidth: "350px", maxWidth: "600px" }}>
      <DialogHeader>
        <DialogTitle>{dialogTranslations.title}</DialogTitle>
      </DialogHeader>
      <div className="h-96 flex flex-col gap-big sm:flex-row relative sm:items-start items-center min-w-0">
        <Tabs
          className="size-full flex flex-col"
          value={selectedTab}
          onValueChange={setSelectedTab as (value: string) => void}
        >
          <div className="w-full flex justify-start pb-medium">
            {/* <TabsList className="justify-start">
              <TabsTrigger value="general">
                {dialogTranslations.tabs.general.title}
              </TabsTrigger>
              <TabsTrigger value="models">
                {dialogTranslations.tabs.models.title}
              </TabsTrigger>
            </TabsList> */}
          </div>
          <TabsContent className="flex-1 min-h-0" value="general" tabIndex={-1}>
            <Droid></Droid>
          </TabsContent>
          <TabsContent className="flex-1 min-h-0" value="models" tabIndex={-1}>
            <div>x2</div>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  );
});

