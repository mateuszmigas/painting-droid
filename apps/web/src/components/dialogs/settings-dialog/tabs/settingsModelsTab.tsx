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
import { memo, useState } from "react";
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

const ModelRow = (props: { userModel: AppUserModelState }) => {
  const { userModel } = props;
  const modelDefinition = modelDefinitions.find(
    (md) => md.type === userModel.type
  ) as BaseModel;
  const [apiKeySet, setApiKeySet] = useState(false);
  const [apiKeyState, setApiKeyState] = useState<"dirty" | "saved">("saved");
  const [apiKeyValue, setApiKeyValue] = useState<string>(
    apiKeySet ? "***" : ""
  );

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
      <div className="flex flex-row gap-big w-full">
        <div className="flex flex-col gap-medium flex-1">
          <Label>Name</Label>
          <Input placeholder="Stability AI" defaultValue="Stability AI 1" />
        </div>
        {modelDefinition?.useApiKey && (
          <div className="flex flex-col gap-medium flex-[2]">
            <Label className={!apiKeySet ? "text-destructive" : ""}>
              Api Key
            </Label>
            <div className="flex flex-row gap-medium items-center justify-center">
              <Input
                value={apiKeyValue}
                onChange={(e) => {
                  setApiKeyValue(e.target.value);
                  setApiKeyState("dirty");
                }}
                type="password"
              />
              <IconSave
                saved={apiKeyState !== "dirty"}
                setSaved={() => {
                  setApiKeyState("saved");
                  setApiKeySet(true);
                }}
                size="small"
                className="w-6 h-6"
                disabled={apiKeyValue === ""}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-row gap-medium items-end">
          {isTextToImageModel(modelDefinition as never) && (
            <Badge
              className="text-primary-foreground"
              style={{ backgroundColor: markerColors[0] }}
              variant="outline"
            >
              Text To Image
            </Badge>
          )}
          {isObjectDetectionModel(modelDefinition as never) && (
            <Badge
              className="text-primary-foreground"
              style={{ backgroundColor: markerColors[1] }}
              variant="outline"
            >
              Object Detection
            </Badge>
          )}
        </div>
        {!modelDefinition?.predefined && (
          <IconButton type="trash" size="small" />
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
  const userModels = useSettingsStore((state) => state.userModels);

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
          <Button disabled={!!selectedModel} variant="secondary">
            <Icon className="mr-2" type="plus-circle" size="small" />
            Add Model
          </Button>
        </div>
        <ScrollArea className="whitespace-nowrap max-h-96">
          <div className="flex flex-col gap-medium w-full">
            {userModels.map((userModel) => (
              <ModelRow key={userModel.id} userModel={userModel} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});

