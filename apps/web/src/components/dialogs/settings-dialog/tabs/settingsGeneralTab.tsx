import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { themes } from "@/constants";
import { useAlertService } from "@/contexts/alertService";
import { useSettingsStore } from "@/store";
import { blobsStorage } from "@/store/blobsStorage";
import { getTranslations } from "@/translations";
import { safeStorage } from "@/utils/safe-storage";
import { memo } from "react";

const translations = getTranslations();

const clearData = async () => {
  await blobsStorage.clearAllBlobs();
  const modelsWithSecrets = useSettingsStore
    .getState()
    .userModels.filter((model) => model.secureKeySet)
    .map((model) => model.id);

  await Promise.all(modelsWithSecrets.map((id) => safeStorage.delete(id)));
  localStorage.clear();
  window.location.reload();
};

export const SettingsGeneralTab = memo(() => {
  const settingsStore = useSettingsStore((state) => state);
  const alertService = useAlertService();

  const onClearData = async () => {
    const result = await alertService.showConfirm(
      translations.alerts.clearData.title,
      translations.alerts.clearData.message,
      {
        content: translations.alerts.clearData.confirm,
        variant: "destructive",
      }
    );
    if (result) {
      clearData();
    }
  };

  return (
    <div className="flex gap-big flex-col justify-between h-full">
      <div className="flex flex-col space-y-form-field-big w-48">
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
      <div className="flex flex-col gap-medium w-48">
        <Button variant="destructive" onClick={onClearData}>
          {translations.alerts.clearData.title}
        </Button>
      </div>
    </div>
  );
});

