import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettingsStore } from "@/store";
import { Icon } from "./icons/icon";
import { themes } from "@/contants";
import { getTranslations } from "@/translations";
const translations = getTranslations();

export const ModeToggle = () => {
  const setTheme = useSettingsStore((state) => state.setTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title="Change theme"
          className={
            "flex justify-center items-center relative hover:bg-accent rounded-md hover:text-accent-foreground p-1 w-6 h-6"
          }
        >
          <Icon
            className="absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            type="sun"
            size="small"
          />
          <Icon
            className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            type="moon"
            size="small"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
            {translations.themes[theme]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

