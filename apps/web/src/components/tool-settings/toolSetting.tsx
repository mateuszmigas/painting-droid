import type { CanvasToolSettingType } from "@/tools/canvasTool";
import { ColorSetting } from "./colorSetting";
import { type CanvasToolId, canvasToolsMetadata } from "@/tools";
import { OptionSetting } from "./optionSetting";
import type { RgbaColor } from "@/utils/color";

export const ToolSetting = (props: {
  toolId: CanvasToolId;
  settingKey: string;
  type: CanvasToolSettingType;
  value: unknown;
  onChange: (newValue: unknown) => void;
}) => {
  const { type, value, onChange, toolId, settingKey } = props;

  if (type === "color") {
    return <ColorSetting value={value as RgbaColor} onChange={onChange} />;
  }
  if (type === "size" || type === "number") {
    const options = canvasToolsMetadata[toolId].settings[settingKey].options;
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

