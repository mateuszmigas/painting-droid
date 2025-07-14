import { useMemo } from "react";
import { chatModelTypes, modelDefinitions } from "@/models/definitions";
import type { ChatModel } from "@/models/types/chatModel";
import { useSettingsStore } from "@/store";
import { getDefaultValues } from "@/utils/customFieldsSchema";

export type ChatModelInfo = {
  id: string;
  display: string;
  definition: ChatModel;
  config: Record<string, unknown>;
};

export const useChatModels = (): ChatModelInfo[] => {
  const userModels = useSettingsStore((state) => state.userModels);

  const models = useMemo(() => {
    return userModels
      .filter((model) => chatModelTypes.includes(model.type))
      .map((model) => {
        const definition = modelDefinitions.find((modelDefinition) => modelDefinition.type === model.type) as ChatModel;

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
