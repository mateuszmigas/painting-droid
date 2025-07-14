import { modelDefinitions, objectDetectionModelTypes } from "@/models/definitions";
import type { ObjectDetectionModel } from "@/models/types/objectDetectionModel";
import { useSettingsStore } from "@/store";
import { getDefaultValues } from "@/utils/customFieldsSchema";

export type ObjectDetectionModelInfo = {
  id: string;
  display: string;
  definition: ObjectDetectionModel;
  config: Record<string, unknown>;
};

export const useObjectDetectionModels = (): ObjectDetectionModelInfo[] => {
  const userModels = useSettingsStore((state) => state.userModels);
  const models = userModels
    .filter((model) => objectDetectionModelTypes.includes(model.type))
    .map((model) => {
      const definition = modelDefinitions.find(
        (modelDefinition) => modelDefinition.type === model.type,
      ) as ObjectDetectionModel;
      return {
        id: model.id,
        display: model.display.trim() ? model.display : definition.defaultName,
        definition,
        config: {
          ...getDefaultValues(definition.configSchema ?? {}),
          ...(model.config ?? {}),
        },
      };
    });
  return models;
};
