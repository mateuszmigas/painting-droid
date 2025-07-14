import { memo } from "react";
import { useSettingsStore } from "@/store";
import { getTranslations } from "@/translations";
import type { RgbaColor } from "@/utils/color";
import { cn } from "@/utils/css";
import { ColorGrid } from "./colorGrid";

const translations = getTranslations();

export const FavoriteColorGrid = memo((props: { onSelected: (color: RgbaColor) => void; className?: string }) => {
  const { onSelected, className } = props;
  const { favoriteColors } = useSettingsStore();
  return (
    <div className={cn("flex flex-col justify-between", className)}>
      <div className="text-xs h-[20px] flex items-center">{translations.general.favorite}</div>
      <ColorGrid onSelected={onSelected} colors={favoriteColors} />
    </div>
  );
});
