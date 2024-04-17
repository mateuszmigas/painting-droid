import { useEffect, useState } from "react";
import { features } from "@/contants";
import { isWeb } from "@/utils/platform";
import { useCommandService } from "@/contexts/commandService";

export const MetadataPanel = () => {
  const [result] = useState<string>("");
  const { executeCommand } = useCommandService();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    executeCommand("openSettingsDialog");
  }, []);

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

