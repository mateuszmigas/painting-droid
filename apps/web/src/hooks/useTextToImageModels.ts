import { modelDefinitions, textToImageModelTypes } from "@/models/definitions";
import type { TextToImageModel } from "@/models/types/textToImageModel";
import { useSettingsStore } from "@/store";
import { getDefaultValues } from "@/utils/customFieldsSchema";
import { useMemo } from "react";

export type TextToImageModelInfo = {
  id: string;
  display: string;
  definition: TextToImageModel;
  config: Record<string, unknown>;
};

export const useTextToImageModels = (): TextToImageModelInfo[] => {
  const userModels = useSettingsStore((state) => state.userModels);

  const models = useMemo(() => {
    return userModels
      .filter((model) => textToImageModelTypes.includes(model.type))
      .map((model) => {
        const definition = modelDefinitions.find(
          (modelDefinition) => modelDefinition.type === model.type
        ) as TextToImageModel;

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
