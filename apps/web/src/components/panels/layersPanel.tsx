import { translations } from "@/translations";
import { PanelHeader } from "./panelHeader";
import { IconButton } from "../iconButton";
import { cn } from "@/utils/css";
import { useWorkspacesStore } from "@/store";
import {
  activeWorkspaceCanvasDataSelector,
  type Layer,
} from "@/store/workspacesStore";
import { memo, useMemo } from "react";

const LayerItem = (props: {
  layer: Layer;
  selected: boolean;
  onClick: () => void;
}) => {
  const { layer, onClick } = props;
  const { showLayer, hideLayer } = useWorkspacesStore((state) => state);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={onClick}
      className={cn(
        "border flex flex-row p-small gap-small items-center overflow-hidden min-h-16",
        props.selected && "border-primary bg-primary/25"
      )}
    >
      <IconButton
        type={layer.visible ? "visible" : "hidden"}
        size="small"
        onClick={() =>
          layer.visible ? hideLayer(layer.id) : showLayer(layer.id)
        }
      />

      <div className="min-w-16 min-h-12 border box-content border-black alpha-background">
        {layer.compressedData && (
          <img width={64} src={layer.compressedData.data} alt={layer.name} />
        )}
      </div>
      <div className="truncate flex-1 ml-1">{layer.name}</div>
    </div>
  );
};

export const LayersPanel = memo(() => {
  const {
    addLayer,
    removeLayer,
    duplicateLayer,
    selectLayer,
    moveLayerUp,
    moveLayerDown,
  } = useWorkspacesStore((state) => state);
  const { layers, activeLayerIndex } = useWorkspacesStore(
    activeWorkspaceCanvasDataSelector
  );
  const activeLayerId = layers[activeLayerIndex].id;
  const reverseLayers = useMemo(() => [...layers].reverse(), [layers]);

  return (
    <div className="flex flex-col size-full">
      <PanelHeader title={translations.layers} />
      <div className="flex flex-row gap-small p-small mt-small items-center justify-between">
        <div className="flex flex-row gap-small items-center">
          <IconButton type="plus" size="small" onClick={() => addLayer()} />
          <IconButton
            type="copy"
            size="small"
            onClick={() => duplicateLayer(activeLayerId)}
          />
          <IconButton
            type="arrow-up"
            size="small"
            onClick={() => moveLayerUp(activeLayerId)}
          />
          <IconButton
            type="arrow-down"
            size="small"
            onClick={() => moveLayerDown(activeLayerId)}
          />
        </div>
        <IconButton
          type="x"
          size="small"
          onClick={() => removeLayer(activeLayerId)}
        />
      </div>
      <div className="flex flex-col gap-small overflow-auto p-small">
        {reverseLayers.map((layer) => (
          <LayerItem
            key={layer.id}
            layer={layer}
            selected={activeLayerId === layer.id}
            onClick={() => selectLayer(layer.id)}
          />
        ))}
      </div>
    </div>
  );
});
