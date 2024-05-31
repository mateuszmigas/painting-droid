import { imageToImageModelTypes, modelDefinitions } from "@/models/definitions";
import type { ImageToImageModel } from "@/models/types/imageToImageModel";
import { useSettingsStore } from "@/store";
import { getDefaultValues } from "@/utils/customFieldsSchema";
import { useMemo } from "react";

export type ImageToImageModelInfo = {
  id: string;
  display: string;
  definition: ImageToImageModel;
  config: Record<string, unknown>;
};

export const useImageToImageModels = (): ImageToImageModelInfo[] => {
  const userModels = useSettingsStore((state) => state.userModels);

  const models = useMemo(() => {
    return userModels
      .filter((model) => imageToImageModelTypes.includes(model.type))
      .map((model) => {
        const definition = modelDefinitions.find(
          (modelDefinition) => modelDefinition.type === model.type
        ) as ImageToImageModel;

        return {
          id: model.id,
          display: model.display.trim()
            ? model.display
            : definition.defaultName,
          definition,
          config: {
            ...getDefaultValues(definition.configSchema ?? {}),
            ...(model.config ?? {}),
          },
        };
      });
  }, [userModels]);

  return models;
};

