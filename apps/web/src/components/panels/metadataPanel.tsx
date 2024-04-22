import { useEffect, useState } from "react";
import { features } from "@/contants";
import { appVersion, isWeb } from "@/utils/platform";
import { useCommandService } from "@/contexts/commandService";

export const MetadataPanel = () => {
  const [result] = useState<string>("");
  const { executeCommand } = useCommandService();

  useEffect(() => {
    executeCommand("openTextToImageDialog");
  });

  return (
    <div className="flex flex-col gap-medium">
      <div className="p-small text-xs">
        <div>App Version: {appVersion()}</div>
        <div>Offscreen canvas: {features.offscreenCanvas.toString()}</div>
        <div>Platform: {isWeb() ? "Web" : "Desktops"}</div>
        <div className="p-small">{result}</div>
      </div>
    </div>
  );
};

