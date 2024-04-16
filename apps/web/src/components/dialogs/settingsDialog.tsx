import { getTranslations } from "@/translations";
import { memo, useState } from "react";
import { Button } from "../ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSettingsStore } from "@/store";
import { themes } from "@/contants";

const dialogTranslations = getTranslations().dialogs.settings;
const translations = getTranslations();

type SettingsTab = "general";

export const SettingsDialog = memo(
  (props: { initialTab?: SettingsTab; close: () => void }) => {
    const { initialTab, close } = props;
    const [selectedTab, setSelectedTab] = useState<SettingsTab>(
      initialTab ?? "general"
    );

    const settingsStore = useSettingsStore((state) => state);

    return (
      <DialogContent style={{ minWidth: "fit-content" }}>
        <DialogHeader>
          <DialogTitle>{dialogTranslations.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-big sm:flex-row relative sm:items-start items-center">
          <div className="flex h-full flex-col gap-big w-full">
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab as (value: string) => void}
            >
              <div className="w-full flex justify-start pb-medium">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="general">
                    {dialogTranslations.types.general}
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="general" tabIndex={-1}>
                <div className="flex flex-row gap-big">
                  <div className="flex flex-col gap-medium w-48">
                    <Label>{translations.general.theme}</Label>
                    <Select
                      value={settingsStore.theme}
                      onValueChange={settingsStore.setTheme}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem key={theme} value={theme}>
                            {translations.themes[theme]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="gap-medium flex flex-row justify-end">
              <Button type="button" variant="secondary" onClick={close}>
                {translations.general.close}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    );
  }
);

