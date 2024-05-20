import { useState } from "react";
import { features } from "@/constants";
import { appVersion, platform } from "@/utils/platform";
import { useWorkspacesStore } from "@/store";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";

export const MetadataPanel = () => {
  const [result] = useState<string>("");
  const { shapes, activeShapeId } = useWorkspacesStore((state) =>
    activeWorkspaceCanvasDataSelector(state)
  );

  return (
    <div className="flex flex-col gap-medium">
      <div className="p-small text-xs">
        <div>App Version: {appVersion()}</div>
        <div>Platform: {platform}</div>
        <div>Offscreen canvas: {features.offscreenCanvas.toString()}</div>
        <div>Menu bar: {features.nativeMenuBar ? "Native" : "Custom"}</div>
        <div>
          Color picker: {features.nativeColorPicker ? "Native" : "Custom"}
        </div>
        <div className="p-small">{result}</div>
        <div>
          <div>active</div>
          {activeShapeId}
          <div>all</div>
          {Object.entries(shapes).map((shape, index) => (
            <div key={index}>{shape[0]}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
