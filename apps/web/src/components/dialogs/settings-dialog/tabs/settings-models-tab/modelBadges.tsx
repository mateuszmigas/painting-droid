import { Badge } from "@/components/ui/badge";
import {
  isTextToImageModel,
  isObjectDetectionModel,
} from "@/models/definitions";
import { markerColors } from "@/contants";
import type { BaseModel } from "@/models/types/baseModel";
import { getTranslations } from "@/translations";
import { memo } from "react";

const translations = getTranslations();

export const ModelBadges = memo((props: { baseModel: BaseModel }) => {
  const { baseModel } = props;
  return (
    <div className="flex flex-row gap-medium items-end">
      {isTextToImageModel(baseModel as never) && (
        <Badge
          className="text-primary-foreground"
          style={{ backgroundColor: markerColors[0] }}
          variant="outline"
        >
          {translations.models.textToImage.name}
        </Badge>
      )}
      {isObjectDetectionModel(baseModel as never) && (
        <Badge
          className="text-primary-foreground"
          style={{ backgroundColor: markerColors[1] }}
          variant="outline"
        >
          {translations.models.objectDetection.name}
        </Badge>
      )}
    </div>
  );
});

