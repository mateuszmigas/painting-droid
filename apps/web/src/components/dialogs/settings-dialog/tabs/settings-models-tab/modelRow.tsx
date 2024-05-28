import { useSettingsStore } from "@/store";
import { IconButton } from "@/components/icons/iconButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { IconSave } from "@/components/icons/iconSave";
import { modelDefinitions } from "@/models/definitions";
import type { AppUserModelState } from "@/store/settingsStore";
import { IconAnchor } from "@/components/icons/iconAnchor";
import type { BaseModel } from "@/models/types/baseModel";
import { safeStorage } from "@/utils/safe-storage";
import { ModelBadges } from "./modelBadges";
import { defaultSecureKeyPlaceholder } from "./settingsModelsTab";
import { useScrollAndFocus } from "@/hooks";
import { getTranslations } from "@/translations";
import { CustomFieldArray } from "@/components/custom-fields/customFieldArray";

const translations = getTranslations();

export const ModelRow = (props: {
  userModel: AppUserModelState;
  onRemove: (id: string) => void;
  shouldFocus: boolean;
}) => {
  const { userModel, onRemove, shouldFocus } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const modelDefinition = modelDefinitions.find(
    (modelDefinition) => modelDefinition.type === userModel.type
  ) as BaseModel;

  const { updateModel } = useSettingsStore((state) => state);
  const [secureKeySaved, setSecureKeySaved] = useState<boolean>(
    !!userModel.secureKeySet
  );
  const [secureKeyValue, setSecureKeyValue] = useState<string>(
    userModel.secureKeySet ? defaultSecureKeyPlaceholder : ""
  );
  useScrollAndFocus(shouldFocus, inputRef);

  const modelConfig = userModel.config ?? {};

  return (
    <div className="flex rounded-md border flex-col p-big items-start gap-medium pt-medium">
      <div className="w-full flex flex-row items-center gap-big justify-between">
        <span className="font-bold">{modelDefinition?.defaultName}</span>
        {modelDefinition?.url && (
          <IconAnchor
            type="external-link"
            size="small"
            href={modelDefinition.url}
          />
        )}
      </div>
      {!modelDefinition.predefined && (
        <div className="flex flex-row gap-big w-full">
          <div className="flex flex-col gap-medium flex-1">
            <Label>{translations.general.name}</Label>
            <Input
              value={userModel.display}
              ref={inputRef}
              placeholder={modelDefinition.defaultName}
              onChange={(e) => {
                updateModel(userModel.id, { display: e.target.value });
              }}
            />
          </div>
          {modelDefinition?.useApiKey && (
            <div className="flex flex-col gap-medium flex-[2]">
              <Label className={!secureKeyValue ? "text-destructive" : ""}>
                {translations.general.secret}
              </Label>
              <div className="flex flex-row gap-medium items-center justify-center">
                <Input
                  value={secureKeyValue}
                  onChange={(e) => {
                    setSecureKeySaved(false);
                    setSecureKeyValue(e.target.value);
                  }}
                  type="password"
                />
                <IconSave
                  saved={secureKeySaved}
                  setSaved={async () => {
                    safeStorage.set(userModel.id, secureKeyValue).then(() => {
                      updateModel(userModel.id, { secureKeySet: true });
                      setSecureKeySaved(true);
                      setSecureKeyValue(defaultSecureKeyPlaceholder);
                    });
                  }}
                  size="small"
                  className="min-w-6 min-h-6"
                  disabled={secureKeyValue === ""}
                />
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col gap-big">
        <CustomFieldArray
          schema={modelDefinition.configSchema ?? {}}
          values={modelConfig}
          onChange={(key, value) =>
            updateModel(userModel.id, {
              config: { ...modelConfig, [key]: value },
            })
          }
        />
      </div>
      <div className="flex items-center justify-between w-full">
        <ModelBadges baseModel={modelDefinition} />
        {!modelDefinition?.predefined && (
          <IconButton
            type="trash"
            size="small"
            onClick={() => onRemove(userModel.id)}
          />
        )}
      </div>
    </div>
  );
};
