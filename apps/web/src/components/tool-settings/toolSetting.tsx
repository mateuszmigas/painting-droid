import { DrawToolSettingType } from "@/tools/draw-tools/drawTool";
import { ColorSetting } from "./colorSetting";
import { ToolId, toolsMetadata } from "@/tools";
import { OptionSetting } from "./optionSetting";

export const ToolSetting = (props: {
  toolId: ToolId;
  settingKey: string;
  type: DrawToolSettingType;
  value: unknown;
  onChange: (newValue: unknown) => void;
}) => {
  const { type, value, onChange, toolId, settingKey } = props;

  if (type === "color") {
    return <ColorSetting value={value as string} onChange={onChange} />;
  }
  if (type === "size") {
    const options = toolsMetadata[toolId].settings[settingKey].options;
    return (
      <OptionSetting
        value={value as number}
        onChange={onChange}
        options={options as { value: number; label: string }[]}
      />
    );
  }

  return null;
};

