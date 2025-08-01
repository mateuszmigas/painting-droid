import { useState } from "react";
import { features } from "@/features";
import { appVersion, platform } from "@/utils/platform";

const boolToString = (value: boolean) => (value ? "On" : "Off");

export const MetadataPanel = () => {
  const [result] = useState<string>("");

  return (
    <div className="flex flex-col gap-medium">
      <div className="p-small text-xs">
        <div>App Version: {appVersion()}</div>
        <div>Platform: {platform}</div>
        <h1 className="font-bold mt-small">Features</h1>
        <div>Offscreen canvas: {boolToString(features.offscreenCanvas)}</div>
        <div>Compute shaders: {boolToString(features.computeShaders)}</div>
        <div>Menu bar: {features.nativeMenuBar ? "Native" : "Custom"}</div>
        <div>Color picker: {features.nativeColorPicker ? "Native" : "Custom"}</div>
        <div className="p-small">{result}</div>
      </div>
    </div>
  );
};
