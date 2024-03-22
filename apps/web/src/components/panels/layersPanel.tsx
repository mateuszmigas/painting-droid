import { IconButton } from "../icons/iconButton";
import { cn } from "@/utils/css";
import { useWorkspacesStore } from "@/store";
import { activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { memo, useMemo } from "react";
import type { CanvasLayer } from "@/canvas/canvasState";
import { useCanvasActionDispatcher } from "@/hooks";

const LayerItem = (props: {
  layer: CanvasLayer;
  selected: boolean;
  onClick: () => void;
  setVisibility: (visible: boolean) => void;
}) => {
  const { layer, selected, onClick, setVisibility } = props;
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={onClick}
      className={cn(
        "rounded-sm flex border-2 flex-row p-small gap-small items-center overflow-hidden min-h-16",
        selected && "border-primary"
      )}
    >
      <IconButton
        type={layer.visible ? "visible" : "hidden"}
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          setVisibility(!layer.visible);
        }}
      />
      <div className="w-16 h-16 border box-content alpha-background">
        {layer.data && (
          <img
            className="size-full object-contain"
            src={layer.data.data}
            alt={layer.name}
          />
        )}
      </div>
      <div className="truncate flex-1 ml-1">{layer.name}</div>
    </div>
  );
};

export const LayersPanel = memo(() => {
  const { layers, activeLayerIndex } = useWorkspacesStore(
    activeWorkspaceCanvasDataSelector
  );
  const activeLayerId = layers[activeLayerIndex].id;
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const reverseLayers = useMemo(() => [...layers].reverse(), [layers]);

  return (
    <div className="flex flex-col size-full p-small gap-small">
      <div className="flex flex-row gap-small items-center justify-between">
        <div className="flex flex-row gap-small items-center">
          <IconButton
            type="plus"
            size="small"
            onClick={() => canvasActionDispatcher.execute("addLayer", {})}
          />
          <IconButton
            type="copy"
            size="small"
            onClick={() =>
              canvasActionDispatcher.execute("duplicateLayer", {
                layerId: activeLayerId,
              })
            }
          />
          <IconButton
            disabled={activeLayerIndex === layers.length - 1}
            type="arrow-up"
            size="small"
            onClick={() =>
              canvasActionDispatcher.execute("moveLayerUp", {
                layerId: activeLayerId,
              })
            }
          />
          <IconButton
            disabled={activeLayerIndex === 0}
            type="arrow-down"
            size="small"
            onClick={() =>
              canvasActionDispatcher.execute("moveLayerDown", {
                layerId: activeLayerId,
              })
            }
          />
        </div>
        <IconButton
          disabled={layers.length === 1}
          type="x"
          size="small"
          onClick={() =>
            canvasActionDispatcher.execute("removeLayer", {
              layerId: activeLayerId,
            })
          }
        />
      </div>
      <div className="flex flex-col gap-small overflow-auto relative flex-1">
        {reverseLayers.map((layer, index) => (
          <div
            className="absolute transition-transform duration-standard bg-background"
            style={{
              transform: `translateY(${index * (76 + 6)}px)`,
              zIndex: activeLayerId === layer.id ? 1 : 0,
              width: "100%",
            }}
            key={layer.id}
          >
            <LayerItem
              layer={layer}
              selected={activeLayerId === layer.id}
              onClick={() =>
                canvasActionDispatcher.execute("selectLayer", {
                  layerId: layer.id,
                })
              }
              setVisibility={(visible) =>
                canvasActionDispatcher.execute(
                  visible ? "showLayer" : "hideLayer",
                  { layerId: layer.id }
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
});
