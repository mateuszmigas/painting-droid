import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/icons/iconButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { memo, useEffect, useRef, useState } from "react";
import { IconSave } from "@/components/icons/iconSave";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons/icon";
import {
  type ModelType,
  modelDefinitions,
  isTextToImageModel,
  isObjectDetectionModel,
} from "@/models/definitions";
import type { AppUserModelState } from "@/store/settingsStore";
import { IconAnchor } from "@/components/icons/iconAnchor";
import { markerColors } from "@/contants";
import type { BaseModel } from "@/models/types/baseModel";
import { getTranslations } from "@/translations";
import { uuid } from "@/utils/uuid";
import { safeStorage } from "@/utils/safe-storage";

const translations = getTranslations();

const ModelBadges = (props: { baseModel: BaseModel }) => {
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
};

const defaultKeyValue = "***************";
const ModelRow = (props: {
  focus: boolean;
  userModel: AppUserModelState;
  onRemove: (id: string) => void;
}) => {
  const { userModel } = props;
  const modelDefinition = modelDefinitions.find(
    (md) => md.type === userModel.type
  ) as BaseModel;
  const [apiKeySaved, setApiKeySaved] = useState<boolean>(true);
  const [apiKeyValue, setApiKeyValue] = useState<string>(defaultKeyValue);
  const { updateModel } = useSettingsStore((state) => state);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    safeStorage.has(userModel.id).then((hasKey) => {
      setApiKeyValue(hasKey ? defaultKeyValue : "");
      setApiKeySaved(hasKey);
    });
  }, [userModel.id]);

  useEffect(() => {
    if (props.focus) {
      inputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [props.focus]);

  return (
    <div className="flex rounded-md border flex-col p-big items-start gap-medium pt-medium">
      <div className="w-full flex flex-row items-center gap-big justify-between">
        <span className="font-bold">{modelDefinition?.defaultName}</span>
        {modelDefinition?.url && (
          <IconAnchor
            type="external-link"
            size="small"
            href={modelDefinition?.url}
          />
        )}
      </div>
      {!modelDefinition.predefined && (
        <div className="flex flex-row gap-big w-full">
          <div className="flex flex-col gap-medium flex-1">
            <Label>Name</Label>
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
              <Label className={!apiKeyValue ? "text-destructive" : ""}>
                Api Key
              </Label>
              <div className="flex flex-row gap-medium items-center justify-center">
                <Input
                  value={apiKeyValue}
                  onChange={(e) => {
                    setApiKeySaved(false);
                    setApiKeyValue(e.target.value);
                  }}
                  type="password"
                />
                <IconSave
                  saved={apiKeySaved}
                  setSaved={async () => {
                    safeStorage.set(userModel.id, apiKeyValue).then(() => {
                      setApiKeySaved(true);
                      setApiKeyValue(defaultKeyValue);
                    });
                  }}
                  size="small"
                  className="min-w-6 min-h-6"
                  disabled={apiKeyValue === ""}
                />
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-between w-full">
        <ModelBadges baseModel={modelDefinition} />
        {!modelDefinition?.predefined && (
          <IconButton
            type="trash"
            size="small"
            onClick={() => {
              props.onRemove(userModel.id);
            }}
          />
        )}
      </div>
    </div>
  );
};

export const SettingsModelsTab = memo(() => {
  const models = modelDefinitions.filter((md) => !md.predefined);
  const [selectedModel, setSelectedModel] = useState<ModelType | "">(
    models.length > 0 ? models[0].type : ""
  );
  const { userModels, addModel, removeModel } = useSettingsStore(
    (state) => state
  );
  const hostRef = useRef<HTMLDivElement>(null);
  const scrollTo = useRef<number | null>(null);

  return (
    <div className="flex flex-row gap-big">
      <div className="flex flex-col gap-big w-full">
        <div className="flex flex-row gap-medium">
          <Select
            value={selectedModel}
            onValueChange={setSelectedModel as (_: string) => void}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {models.map((md) => (
                <SelectItem key={md.type} value={md.type}>
                  {md.defaultName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            disabled={!selectedModel}
            variant="secondary"
            onClick={() => {
              addModel({
                id: uuid(),
                type: selectedModel as ModelType,
                display: modelDefinitions.find(
                  (md) => md.type === selectedModel
                )?.defaultName as string,
              });
              scrollTo.current = userModels.length;
            }}
          >
            <Icon className="mr-2" type="plus-circle" size="small" />
            Add Model
          </Button>
        </div>
        <ScrollArea className="whitespace-nowrap max-h-96 min-h-96 overflow-auto">
          <div
            ref={hostRef}
            className="relative flex flex-col gap-medium w-full"
          >
            {userModels.map((userModel, index) => (
              <ModelRow
                key={userModel.id}
                focus={index === scrollTo.current}
                userModel={userModel}
                onRemove={(id) => {
                  return removeModel(id);
                }}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});
