import { Droid } from "@/components/droid";
import { Typewriter } from "@/components/typewriter";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { themes } from "@/constants";
import { useTypewriter } from "@/hooks";
import { useSettingsStore } from "@/store";
import { getTranslations } from "@/translations";
import dark_theme from "./assets/dark_theme.png";
import light_theme from "./assets/light_theme.png";
import system_theme from "./assets/system_theme.png";

const getAsset = (theme: string) => {
  switch (theme) {
    case "light":
      return light_theme;
    case "dark":
      return dark_theme;
    case "system":
      return system_theme;
  }
};

const translations = getTranslations();
const message = translations.dialogs.welcome.pages.theme.message;

export const ThemesPage = () => {
  const typewriter = useTypewriter(message);
  const settingsStore = useSettingsStore((state) => state);
  return (
    <div className="flex flex-col gap-big">
      <RadioGroup
        value={settingsStore.theme}
        onValueChange={settingsStore.setTheme}
        className="grid grid-cols-3 gap-big"
      >
        {themes.map((theme) => (
          <div key={theme}>
            <RadioGroupItem value={theme} id={theme} className="peer sr-only" />
            <Label
              htmlFor={theme}
              className="flex flex-col gap-small items-center justify-between rounded-md border-2 border-muted bg-popover p-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <img width={200} height={150} src={getAsset(theme)} alt={theme} />
              <div className="font-bold">{translations.themes[theme]}</div>
            </Label>
          </div>
        ))}
      </RadioGroup>
      <div className="flex flex-row gap-big items-center">
        <div className="max-w-12 min-w-12">
          <Droid typingDurationSeconds={typewriter.typingDurationSeconds} />
        </div>
        <Typewriter
          className="font-mono text-sm"
          text={message}
          typingDurationSeconds={typewriter.typingDurationSeconds}
        />
      </div>
    </div>
  );
};
