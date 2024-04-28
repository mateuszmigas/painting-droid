import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { themes } from "@/constants";
import { useSettingsStore } from "@/store";
import { getTranslations } from "@/translations";
import { Label } from "@radix-ui/react-dropdown-menu";
import { memo } from "react";

const translations = getTranslations();

export const SettingsGeneralTab = memo(() => {
  const settingsStore = useSettingsStore((state) => state);

  return (
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
  );
});

