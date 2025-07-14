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
      <IconButton {...createCellProps("top-left")} type="anchor-top-left" />
      <IconButton {...createCellProps("top")} type="anchor-top" />
      <IconButton {...createCellProps("top-right")} type="anchor-top-right" />
      <IconButton {...createCellProps("left")} type="anchor-left" />
      <IconButton {...createCellProps("center")} type="image" />
      <IconButton {...createCellProps("right")} type="anchor-right" />
      <IconButton {...createCellProps("bottom-left")} type="anchor-bottom-left" />
      <IconButton {...createCellProps("bottom")} type="anchor-bottom" />
      <IconButton {...createCellProps("bottom-right")} type="anchor-bottom-right" />
    </div>
  );
};
