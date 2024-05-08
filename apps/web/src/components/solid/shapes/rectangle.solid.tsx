/* @jsxImportSource solid-js */
import { type RgbaColor, rgbaToRgbaString } from "@/utils/color";
import type { Position, Size } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";

export type RectangleProps = {
  position: Position;
  size: Size;
  fillColor?: RgbaColor;
  stroke?: {
    color: RgbaColor;
    width: number;
  };
};

export const Rectangle = (props: RectangleProps & { viewport: Viewport }) => {
  return (
    <rect
      x={props.position.x * props.viewport.zoom + props.viewport.position.x}
      y={props.position.y * props.viewport.zoom + props.viewport.position.y}
      width={props.size.width * props.viewport.zoom}
      height={props.size.height * props.viewport.zoom}
      fill={props.fillColor ? rgbaToRgbaString(props.fillColor) : undefined}
      stroke={props.stroke ? rgbaToRgbaString(props.stroke.color) : undefined}
      stroke-width={props.stroke ? props.stroke.width : undefined}
    />
  );
};

