import { memo, useEffect } from "react";
import { Button } from "../ui/button";
import { useWorkspacesStore } from "@/store";
import {
  activeWorkspaceActiveLayerSelector,
  activeWorkspaceCanvasDataSelector,
  activeWorkspaceSelector,
} from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import { coreClient } from "@/wasm/core/coreClient";
import { useCanvasActionDispatcher, useStableCallback } from "@/hooks";
import { adjustmentsMetadata } from "@/adjustments";
import { useCanvasPreviewContextStore } from "@/contexts/canvasPreviewContextStore";
import {
  clearContext,
  restoreContextFromCompressed,
  restoreContextFromUncompressed,
} from "@/utils/canvas";
import { ImageProcessor } from "@/utils/imageProcessor";

const translations = getTranslations();

export const AdjustmentsPopup = memo(() => {
  const popup = useWorkspacesStore(
    (store) => activeWorkspaceSelector(store).popup!
  );
  const { layers, activeLayerIndex } = useWorkspacesStore((s) =>
    activeWorkspaceCanvasDataSelector(s)
  );
  const canvasDispatcher = useCanvasActionDispatcher();
  const closePopup = useWorkspacesStore((store) => store.closeApplyPopup);
  const adjustment = adjustmentsMetadata[popup.adjustmentId];
  const activeLayer = layers[activeLayerIndex];
  const { rasterContext: previewContext } = useCanvasPreviewContextStore();

  const runAdjustment = useStableCallback(async () => {
    const data = activeLayer.data;
    if (!data) {
      return null;
    }
    const input = await ImageProcessor.fromCompressedData(data).toImageData();
    return await coreClient[popup.adjustmentId](input);
  });

  const applyToLayer = useStableCallback(async () => {
    const imageData = await runAdjustment();

    if (!imageData) {
      return;
    }

    const data = await ImageProcessor.fromUncompressed(
      imageData
    ).toCompressedData();

    await canvasDispatcher.execute("updateLayerData", {
      layerId: activeLayer.id,
      display: adjustment.name,
      icon: "brain",
      data,
    });
    closePopup();
  });

  useEffect(() => {
    const run = async () => {
      const imageData = await runAdjustment();
      if (!imageData) {
        return;
      }
      previewContext &&
        restoreContextFromUncompressed(previewContext, imageData);
    };
    run();
  }, [previewContext, runAdjustment]);

  useEffect(() => {
    return () => {
      if (previewContext !== null) {
        const activeLayer = activeWorkspaceActiveLayerSelector(
          useWorkspacesStore.getState()
        );
        if (activeLayer.data) {
          restoreContextFromCompressed(previewContext, activeLayer.data);
        } else {
          clearContext(previewContext);
        }
      }
    };
  }, [previewContext]);

  return (
    <div className="flex flex-col gap-big">
      <div>{adjustment.name}</div>
      <div className="flex flex-row justify-end gap-medium">
        <Button variant="secondary" onClick={closePopup}>
          {translations.general.cancel}
        </Button>
        <Button onClick={() => applyToLayer()}>
          {translations.general.apply}
        </Button>
      </div>
    </div>
  );
});

