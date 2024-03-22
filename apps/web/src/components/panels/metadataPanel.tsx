import { useWorkspacesStore } from "@/store";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { Button } from "../ui/button";
import { useState } from "react";
import { xenovaClient } from "@/models/local/xenovaClient";
import { coreClient } from "@/wasm/core/coreClient";

export const MetadataPanel = () => {
  const [result, setResult] = useState<string>("");

  const classifyLayer = async () => {
    const { layers, activeLayerIndex } = activeWorkspaceCanvasDataSelector(
      useWorkspacesStore.getState()
    );
    const data = layers[activeLayerIndex].data;
    if (!data) {
      setResult("No data to classify");
    } else {
      xenovaClient.classifyImage(data).then((res) => {
        setResult(res.result);
      });
    }
  };
  const callRust = async () => {
    const now = performance.now();
    coreClient.hello("Zdzicho2").then((res) => {
      const time = performance.now() - now;
      setResult(`${res.result} in ${time}ms`);
    });
  };

  return (
    <div className="flex flex-col gap-medium">
      <div className="flex flex-wrap flex-row gap-small p-small">
        <Button variant="secondary" onClick={classifyLayer}>
          Classify Layer
        </Button>
        <Button variant="secondary" onClick={callRust}>
          Call Rust
        </Button>
      </div>
      <div className="p-small">{result}</div>
    </div>
  );
};
