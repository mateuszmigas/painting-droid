import { memo } from "react";
import { useSettingsStore } from "@/store";
import { getTranslations } from "@/translations";
import type { RgbaColor } from "@/utils/color";
import { cn } from "@/utils/css";
import { ColorGrid } from "./colorGrid";

const translations = getTranslations();

export const RecentColorGrid = memo((props: { onSelected: (color: RgbaColor) => void; className?: string }) => {
  const { onSelected, className } = props;
  const { recentColors } = useSettingsStore();
  return (
    <div className={cn("flex flex-col justify-between", className)}>
      <div className="text-xs h-[20px] flex items-center">{translations.general.recent}</div>
      <ColorGrid onSelected={onSelected} colors={recentColors} />
    </div>
  );
});
