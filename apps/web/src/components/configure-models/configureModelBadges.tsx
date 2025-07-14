import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { markerColors } from "@/constants";
import {
  isChatModel,
  isImageToImageModel,
  isObjectDetectionModel,
  isRemoveBackgroundModel,
  isTextToImageModel,
} from "@/models/definitions";
import type { BaseModel } from "@/models/types/baseModel";
import { getTranslations } from "@/translations";

const translations = getTranslations();

export const ConfigureModelBadges = memo((props: { baseModel: BaseModel }) => {
  const { baseModel } = props;
  return (
    <div className="flex flex-row gap-medium items-end">
      {isTextToImageModel(baseModel as never) && (
        <Badge className="text-primary-foreground" style={{ backgroundColor: markerColors[0] }} variant="outline">
          {translations.models.textToImage.name}
        </Badge>
      )}
      {isImageToImageModel(baseModel as never) && (
        <Badge className="text-primary-foreground" style={{ backgroundColor: markerColors[1] }} variant="outline">
          {translations.models.textToImage.name}
        </Badge>
      )}
      {isObjectDetectionModel(baseModel as never) && (
        <Badge className="text-primary-foreground" style={{ backgroundColor: markerColors[2] }} variant="outline">
          {translations.models.labelObjects.name}
        </Badge>
      )}
      {isRemoveBackgroundModel(baseModel as never) && (
        <Badge className="text-primary-foreground" style={{ backgroundColor: markerColors[3] }} variant="outline">
          {translations.models.removeBackground.name}
        </Badge>
      )}
      {isChatModel(baseModel as never) && (
        <Badge className="text-secondary-foreground" style={{ backgroundColor: markerColors[4] }} variant="outline">
          {translations.models.chat.name}
        </Badge>
      )}
    </div>
  );
});
