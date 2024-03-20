import { useWorkspacesStore } from "@/store";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { Button } from "../ui/button";
import { useState } from "react";
import { xenovaClient } from "@/models/local/xenovaClient";
import { coreClient } from "@/wasm/core/coreClient";
import { useDialogService } from "@/contexts/dialogService";
import { GenerateImageDialog } from "../dialogs/generateImageDialog";
import { useCanvasActionDispatcher } from "@/hooks";
import { useCommandService } from "@/contexts/commandService";

export const MetadataPanel = () => {
  const [result, setResult] = useState<string>("");
  const { openDialog } = useDialogService();
  const canvasDispatcher = useCanvasActionDispatcher();
  const { executeCommand } = useCommandService();
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
    coreClient.hello("Zdzicho").then((res) => {
      const time = performance.now() - now;
      setResult(`${res.result} in ${time}ms`);
    });
  };
  const generateImage = async () => {
    const result = await openDialog(GenerateImageDialog, {});
    if (result) {
      const box = {
        x: 0,
        y: 0,
        width: result.data!.width,
        height: result.data!.height,
      };
      executeCommand("selectTool", { toolId: "rectangleSelect" });
      canvasDispatcher.execute("drawOverlayShape", {
        overlayShape: {
          type: "rectangle",
          boundingBox: box,
          captured: { box, data: result.data! },
        },
      });
    }
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
        <Button variant="secondary" onClick={generateImage}>
          Generate image
        </Button>
      </div>
      <div className="p-small">{result}</div>
    </div>
  );
};
