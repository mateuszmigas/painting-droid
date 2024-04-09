import { IconButton } from "../icons/iconButton";

export type ImageAnchorType =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

export const ImageAnchor = (props: {
  selectedAnchor: ImageAnchorType;
  onChange: (anchor: ImageAnchorType) => void;
}) => {
  const { selectedAnchor, onChange } = props;
  const createCellProps = (anchor: ImageAnchorType) => {
    return {
      className: `border ${
        selectedAnchor === anchor
          ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          : ""
      }`,
      onClick: () => onChange(anchor),
      size: "small",
    } as const;
  };

  return (
    <div
      style={{
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
      }}
      className="grid w-[86px] h-[86px] gap-small place-items-center"
    >
      <IconButton {...createCellProps("top-left")} type="move-up-left" />
      <IconButton {...createCellProps("top")} type="move-up" />
      <IconButton {...createCellProps("top-right")} type="move-up-right" />
      <IconButton {...createCellProps("left")} type="move-left" />
      <IconButton {...createCellProps("center")} type="image" />
      <IconButton {...createCellProps("right")} type="move-right" />
      <IconButton {...createCellProps("bottom-left")} type="move-down-left" />
      <IconButton {...createCellProps("bottom")} type="move-down" />
      <IconButton {...createCellProps("bottom-right")} type="move-down-right" />
    </div>
  );
};

