import { useWorkspacesStore } from "@/store";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { Button } from "../ui/button";
import { useState } from "react";
import { xenovaClient } from "@/models/local/xenovaClient";

export const MetadataPanel = () => {
  const [result, setResult] = useState<string>("");
  const classifyLayer = async () => {
    const { layers, activeLayerIndex } = activeWorkspaceCanvasDataSelector(
      useWorkspacesStore.getState()
    );
    const data = layers[activeLayerIndex].compressedData;
    if (!data) {
      setResult("No data to classify");
    } else {
      xenovaClient.classifyImage(data).then((res) => {
        setResult(res.result);
      });
    }
  };
  return (
    <div className="flex flex-col gap-medium">
      <div className="flex flex-wrap flex-row gap-small p-small">
        <Button variant="secondary" onClick={classifyLayer}>
          Classify Layer
        </Button>
        <div>{result}</div>
      </div>
    </div>
  );
};

