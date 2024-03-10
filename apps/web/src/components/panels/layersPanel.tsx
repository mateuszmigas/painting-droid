import { translations } from "@/translations";
import { PanelHeader } from "./panelHeader";
import { IconButton } from "../iconButton";
import { cn } from "@/utils/css";
import { useWorkspacesStore } from "@/store";
import { Layer } from "@/store/workspacesStore";

const LayerItem = (props: {
  layer: Layer;
  selected: boolean;
  onClick: () => void;
}) => {
  const { layer, onClick } = props;
  const { showLayer, hideLayer, lockLayer, unlockLayer } = useWorkspacesStore(
    (state) => state
  );
  return (
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

      <div className="min-w-16 min-h-12 border border-black bg-white"></div>
      <div className="truncate flex-1 ml-1">{layer.name}</div>
      <div className="flex flex-col justify-between">
        <IconButton
          type={layer.locked ? "lock" : "unlock"}
          size="small"
          onClick={() =>
            layer.locked ? unlockLayer(layer.id) : lockLayer(layer.id)
          }
        />
        {/* <IconButton
          type={layer.locked ? "lock" : "unlock"}
          size="small"
          onClick={() => console.log("eye clicked")}
        /> */}
      </div>
    </div>
  );
};

export const LayersPanel = () => {
  const {
    selectedWorkspaceId,
    addLayer,
    removeLayer,
    duplicateLayer,
    selectLayer,
    moveLayerUp,
    moveLayerDown,
  } = useWorkspacesStore((state) => state);
  const { layers, selectedLayerId } = useWorkspacesStore(
    (state) =>
      state.workspaces.find(
        (workspace) => workspace.id === selectedWorkspaceId
      )!
  );

  return (
    <div className="flex flex-col size-full">
      <PanelHeader title={translations.layers + " (work in progress!!!)"} />
      <div className="flex flex-row gap-small p-small mt-small items-center justify-between">
        <div className="flex flex-row gap-small items-center">
          <IconButton
            type="plus"
            size="small"
            onClick={() => addLayer()}
          ></IconButton>
          <IconButton
            type="copy"
            size="small"
            onClick={() => duplicateLayer(selectedLayerId)}
          ></IconButton>
          <IconButton
            type="arrow-up"
            size="small"
            onClick={() => moveLayerUp(selectedLayerId)}
          ></IconButton>
          <IconButton
            type="arrow-down"
            size="small"
            onClick={() => moveLayerDown(selectedLayerId)}
          ></IconButton>
          <IconButton type="arrow-up-to-line" size="small"></IconButton>
          <IconButton type="arrow-down-to-line" size="small"></IconButton>
        </div>
        <IconButton
          type="x"
          size="small"
          onClick={() => removeLayer(selectedLayerId)}
        ></IconButton>
      </div>
      <div className="flex flex-col gap-small overflow-auto p-small">
        {layers.map((layer) => (
          <LayerItem
            key={layer.id}
            layer={layer}
            selected={selectedLayerId === layer.id}
            onClick={() => selectLayer(layer.id)}
          />
        ))}
      </div>
    </div>
  );
};
