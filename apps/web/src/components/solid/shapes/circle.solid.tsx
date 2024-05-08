/* @jsxImportSource solid-js */
import { type RgbaColor, rgbaToRgbaString } from "@/utils/color";
import type { Position } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";

export type CircleProps = {
  position: Position;
  radius: number;
  fillColor?: RgbaColor;
  stroke?: {
    color: RgbaColor;
    width: number;
  };
};

export const Circle = (props: CircleProps & { viewport: Viewport }) => {
  return (
    <circle
      cx={props.position.x * props.viewport.zoom + props.viewport.position.x}
      cy={props.position.y * props.viewport.zoom + props.viewport.position.y}
      r={props.radius * props.viewport.zoom}
      fill={props.fillColor ? rgbaToRgbaString(props.fillColor) : undefined}
      stroke={props.stroke ? rgbaToRgbaString(props.stroke.color) : undefined}
      stroke-width={props.stroke ? props.stroke.width : undefined}
    />
  );
};

