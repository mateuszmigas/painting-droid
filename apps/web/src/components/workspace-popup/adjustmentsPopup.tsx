import { memo, useEffect } from "react";
import { Button } from "../ui/button";
import { useWorkspacesStore } from "@/store";
import {
  activeWorkspaceActiveLayerSelector,
  activeWorkspaceCanvasDataSelector,
  activeWorkspaceSelector,
} from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import type { ImageUncompressedData } from "@/utils/imageData";
import { coreClient } from "@/wasm/core/coreClient";
import { useCanvasActionDispatcher, useStableCallback } from "@/hooks";
import { adjustmentsMetadata } from "@/adjustments";
import { useCanvasContextStore } from "@/contexts/canvasContextService";
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
  const { activeContext } = useCanvasContextStore();

  const runAdjustment = useStableCallback(async () => {
    const data = activeLayer.data;
    if (!data) {
      return null;
    }
    const input = await ImageProcessor.fromCompressed(data).toImageData();
    return await coreClient[popup.adjustmentId](input);
  });

  const applyToLayer = useStableCallback(async () => {
    const imageData = await runAdjustment();

    if (!imageData) {
      return;
    }

    const data = await ImageProcessor.fromUncompressed(
      imageData
    ).toCompressed();

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
      activeContext &&
        restoreContextFromUncompressed(
          activeContext,
          imageData as ImageUncompressedData
        );
    };
    run();
  }, [activeContext, runAdjustment]);

  useEffect(() => {
    return () => {
      if (activeContext !== null) {
        const activeLayer = activeWorkspaceActiveLayerSelector(
          useWorkspacesStore.getState()
        );
        if (activeLayer.data) {
          restoreContextFromCompressed(activeContext, activeLayer.data);
        } else {
          clearContext(activeContext);
        }
      }
    };
  }, [activeContext]);

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
