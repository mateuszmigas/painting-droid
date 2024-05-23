import { useToolStore } from "@/store/toolState";
import { canvasToolsMetadata } from "@/tools";
import { ToolSetting } from "./tool-settings/toolSetting";
import { Separator } from "@radix-ui/react-separator";
import { testIds } from "@/utils/testIds";
import type { CustomFieldsSchema } from "@/utils/customFieldsSchema";

export const ToolSettingsBar = () => {
  const selectedToolId = useToolStore((state) => state.selectedToolId);
  const settings = useToolStore((state) => state.toolSettings[selectedToolId]);
  const updateToolSettings = useToolStore((state) => state.updateToolSettings);
  const schema = (canvasToolsMetadata[selectedToolId]?.settingsSchema ??
    {}) as CustomFieldsSchema;

  return (
    <div className="h-10 border-b px-2 flex flex-row gap-small items-center">
      {Object.entries(schema).map(([id, customField]) => {
        return (
          <div
            data-testid={testIds.toolSetting(id)}
            key={id}
            className="flex flex-row items-center gap-small text-xs"
          >
            <div className="whitespace-nowrap ">{customField.name}</div>
            <ToolSetting
              customField={schema[id]}
              value={
                settings[id] !== undefined
                  ? settings[id]
                  : customField.defaultValue
              }
              onChange={(newValue) => {
                updateToolSettings(selectedToolId, {
                  ...settings,
                  [id]: newValue,
                });
              }}
            />
            <Separator
              orientation="vertical"
              className="h-6 w-px bg-border mx-1"
            />
          </div>
        );
      })}
    </div>
  );
};

