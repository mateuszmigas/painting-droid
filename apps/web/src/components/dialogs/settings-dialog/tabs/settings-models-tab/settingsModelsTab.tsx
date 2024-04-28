import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons/icon";
import { type ModelType, modelDefinitions } from "@/models/definitions";
import { getTranslations } from "@/translations";
import { uuid } from "@/utils/uuid";
import { ModelRow } from "./modelRow";
import { isWeb } from "@/utils/platform";
import { Link } from "@/components/link";
import { links } from "@/constants";
import type { BaseModel } from "@/models/types/baseModel";
import { safeStorage } from "@/utils/safe-storage";

const translations = getTranslations();
const tabTranslations = translations.dialogs.settings.tabs.models;

export const defaultSecureKeyPlaceholder = "***************";

export const SettingsModelsTab = memo(() => {
  const models = modelDefinitions.filter(
    (md: BaseModel) => !md.predefined && (!md.useApiKey || !isWeb())
  );
  const [selectedModel, setSelectedModel] = useState<ModelType | "">(
    models.length > 0 ? models[0].type : ""
  );
  const { userModels, addModel, removeModel } = useSettingsStore(
    (state) => state
  );
  const hostRef = useRef<HTMLDivElement>(null);
  const scrollTo = useRef<number | null>(null);

  return (
    <div className="size-full flex flex-row gap-big">
      <div className="flex flex-col gap-big w-full flex-1">
        {models.length > 0 && (
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
              {tabTranslations.addModel}
            </Button>
          </div>
        )}
        <ScrollArea className="whitespace-nowrap overflow-auto flex-1">
          <div
            ref={hostRef}
            className="relative flex flex-col gap-medium w-full"
          >
            {userModels.map((userModel, index) => (
              <ModelRow
                key={userModel.id}
                shouldFocus={index === scrollTo.current}
                userModel={userModel}
                onRemove={(id) => {
                  safeStorage.delete(id);
                  removeModel(id);
                }}
              />
            ))}
          </div>
        </ScrollArea>
        {isWeb() && (
          <div className="rounded-md border pb-small px-medium">
            <span className="text-xs">{tabTranslations.message} </span>
            <Link href={links.downloadDesktop} className="text-xs">
              {translations.general.download}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
});

