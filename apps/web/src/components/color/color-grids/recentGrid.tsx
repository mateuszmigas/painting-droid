import { memo } from "react";
import { ColorGrid } from "./colorGrid";
import type { RgbaColor } from "@/utils/color";
import { cn } from "@/utils/css";
import { getTranslations } from "@/translations";
import { useSettingsStore } from "@/store";
const translations = getTranslations();

export const RecentColorGrid = memo(
  (props: { onSelected: (color: RgbaColor) => void; className?: string }) => {
    const { onSelected, className } = props;
    const { recentColors } = useSettingsStore();
    return (
      <div className={cn("flex flex-col justify-between", className)}>
        <div className="text-xs h-[20px] flex items-center">
          {translations.general.recent}
        </div>
        <ColorGrid onSelected={onSelected} colors={recentColors} />
      </div>
    );
  }
);

