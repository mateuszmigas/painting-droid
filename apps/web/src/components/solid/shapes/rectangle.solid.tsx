/* @jsxImportSource solid-js */
import { type RgbaColor, rgbaToRgbaString } from "@/utils/color";
import type { Rectangle as Rectangle2 } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";

export type RectangleProps = {
  rectangle: Rectangle2;
  fillColor?: RgbaColor;
  stroke?: {
    color: RgbaColor;
    width: number;
  };
};

export const Rectangle = (props: RectangleProps & { viewport: Viewport }) => {
  return (
    <rect
      x={props.rectangle.x * props.viewport.zoom + props.viewport.position.x}
      y={props.rectangle.y * props.viewport.zoom + props.viewport.position.y}
      width={props.rectangle.width * props.viewport.zoom}
      height={props.rectangle.height * props.viewport.zoom}
      fill={props.fillColor ? rgbaToRgbaString(props.fillColor) : undefined}
      stroke={props.stroke ? rgbaToRgbaString(props.stroke.color) : undefined}
      stroke-width={props.stroke ? props.stroke.width * props.viewport.zoom : undefined}
    />
  );
};
