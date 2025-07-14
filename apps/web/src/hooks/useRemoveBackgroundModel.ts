import { useMemo } from "react";
import { modelDefinitions, removeBackgroundModelTypes } from "@/models/definitions";
import type { RemoveBackgroundModel } from "@/models/types/removeBackgroundModel";
import { useSettingsStore } from "@/store";
import { getDefaultValues } from "@/utils/customFieldsSchema";

export type RemoveBackgroundModelInfo = {
  id: string;
  display: string;
  definition: RemoveBackgroundModel;
  config: Record<string, unknown>;
};

export const useRemoveBackgroundModels = (): RemoveBackgroundModelInfo[] => {
  const userModels = useSettingsStore((state) => state.userModels);

  const models = useMemo(() => {
    return userModels
      .filter((model) => removeBackgroundModelTypes.includes(model.type))
      .map((model) => {
        const definition = modelDefinitions.find(
          (modelDefinition) => modelDefinition.type === model.type,
        ) as RemoveBackgroundModel;

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
  }, [userModels]);

  return models;
};
