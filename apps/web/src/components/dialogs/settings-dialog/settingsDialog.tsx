import { getTranslations } from "@/translations";
import { memo, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { SettingsModelsTab } from "./tabs/settingsModelsTab";
import { SettingsGeneralTab } from "./tabs/settingsGeneralTab";

const dialogTranslations = getTranslations().dialogs.settings;

type SettingsTab = "general" | "models";

export const SettingsDialog = memo(
  (props: { initialTab?: SettingsTab; close: () => void }) => {
    const { initialTab } = props;
    const [selectedTab, setSelectedTab] = useState<SettingsTab>(
      initialTab ?? "general"
    );

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
              <TabsList className="justify-start">
                <TabsTrigger value="general">
                  {dialogTranslations.tabs.general.title}
                </TabsTrigger>
                <TabsTrigger value="models">
                  {dialogTranslations.tabs.models.title}
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              className="flex-1 min-h-0"
              value="general"
              tabIndex={-1}
            >
              <SettingsGeneralTab />
            </TabsContent>
            <TabsContent
              className="flex-1 min-h-0"
              value="models"
              tabIndex={-1}
            >
              <SettingsModelsTab />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    );
  }
);

