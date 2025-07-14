import { NumberInput } from "../input/numberInput";

export type ImageOffsetType = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export const ImageOffset = (props: { offset: ImageOffsetType; onChange: (offset: ImageOffsetType) => void }) => {
  const { offset, onChange } = props;
  const createCellProps = (type: keyof ImageOffsetType) => {
    return {
      type: "number",
      value: offset[type],
      onChange: (value: number) => onChange({ ...offset, [type]: value }),
      className: "border w-16 h-6 px-small text-center",
      default: 0,
    } as const;
  };
  return (
    <div
      style={{
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
      }}
      className="relative grid gap-small place-items-center border p-small"
    >
      <div />
      <NumberInput {...createCellProps("top")} />
      <div />
      <NumberInput {...createCellProps("left")} />
      <div />
      <NumberInput {...createCellProps("right")} />
      <div />
      <NumberInput {...createCellProps("bottom")} />
      <div />
    </div>
  );
};
