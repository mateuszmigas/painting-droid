import { useState } from "react";
import { features } from "@/contants";
import { isWeb } from "@/utils/platform";

export const MetadataPanel = () => {
  const [result] = useState<string>("");

  return (
    <div className="flex flex-col gap-medium">
      <div className="p-small text-xs">
        <div>Features:</div>
        <div>Offscreen canvas: {features.offscreenCanvas.toString()}</div>
        <div>Platform: {isWeb() ? "Web" : "Desktops"}</div>
        <div className="p-small">{result}</div>
      </div>
    </div>
  );
};

