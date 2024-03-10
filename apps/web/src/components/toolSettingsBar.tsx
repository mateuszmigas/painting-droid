import { useToolStore } from "@/store/toolState";
import { toolsMetadata } from "@/tools";
import { ToolSetting } from "./tool-settings/toolSetting";
import { Separator } from "@radix-ui/react-separator";

export const ToolSettingsBar = () => {
  const selectedToolId = useToolStore((state) => state.selectedToolId);
  const settings = useToolStore((state) => state.toolSettings[selectedToolId]);
  const updateToolSettings = useToolStore((state) => state.updateToolSettings);

  return (
    <div className="h-10 border-b px-2 flex flex-row gap-big items-center">
      {Object.entries(settings).map(([id, value]) => {
        const label = toolsMetadata[selectedToolId].settings[id].name;
        return (
          <div
            key={id}
            className="flex flex-row items-center gap-small text-xs"
          >
            {label}
            <ToolSetting
              toolId={selectedToolId}
              settingKey={id}
              type={toolsMetadata[selectedToolId].settings[id].type}
              value={value}
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

