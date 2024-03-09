import { translations } from "@/translations";
import { PanelHeader } from "./panelHeader";
import { IconButton } from "../iconButton";
import { cn } from "@/utils/css";

type Layer = {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  preview: string;
  //opacity
};

const layers: Layer[] = [
  {
    id: "1",
    name: "Layer 1",
    visible: false,
    locked: true,
    preview: "sss",
  },
  {
    id: "2",
    name: "Layer 2",
    visible: true,
    locked: false,
    preview: "sss",
  },
  {
    id: "3",
    name: "Layer 3",
    visible: true,
    locked: false,
    preview: "sss",
  },
  {
    id: "4",
    name: "Layer 43",
    visible: true,
    locked: false,
    preview: "sss",
  },
];

const LayerItem = (props: { layer: Layer; selected: boolean }) => {
  const { layer } = props;
  return (
    <div
      className={cn(
        "border flex flex-row p-small gap-small items-center overflow-hidden min-h-16",
        props.selected && "border-primary bg-primary/25"
      )}
    >
      <IconButton
        type={layer.visible ? "visible" : "hidden"}
        size="small"
        onClick={() => console.log("eye clicked")}
      />

      <div className="min-w-16 min-h-12 border border-black bg-white"></div>
      <div className="truncate flex-1 ml-1">Name</div>
      <div className="flex flex-col justify-between">
        <IconButton
          type={layer.locked ? "lock" : "unlock"}
          size="small"
          onClick={() => console.log("eye clicked")}
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
  return (
    <div className="flex flex-col size-full">
      <PanelHeader title={translations.layers + " (work in progress!!!)"} />
      <div className="flex flex-row gap-small p-small mt-small items-center justify-between">
        <div className="flex flex-row gap-small items-center">
          <IconButton type="plus" size="small"></IconButton>
          <IconButton type="copy" size="small"></IconButton>
          <IconButton type="arrow-up" size="small"></IconButton>
          <IconButton type="arrow-down" size="small"></IconButton>
          <IconButton type="arrow-up-to-line" size="small"></IconButton>
          <IconButton type="arrow-down-to-line" size="small"></IconButton>
        </div>
        <IconButton type="x" size="small"></IconButton>
      </div>
      <div className="flex flex-col gap-small overflow-auto p-small">
        {layers.map((layer, index) => (
          <LayerItem key={layer.id} layer={layer} selected={index === 1} />
        ))}
      </div>
    </div>
  );
};
