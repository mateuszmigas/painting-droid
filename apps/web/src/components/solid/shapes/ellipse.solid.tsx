/* @jsxImportSource solid-js */
import { type RgbaColor, rgbaToRgbaString } from "@/utils/color";
import type { Rectangle } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";

export type EllipseProps = {
  rectangle: Rectangle;
  fillColor?: RgbaColor;
  stroke?: {
    color: RgbaColor;
    width: number;
  };
};

export const Ellipse = (props: EllipseProps & { viewport: Viewport }) => {
  return (
    <ellipse
      cx={(props.rectangle.x + props.rectangle.width / 2) * props.viewport.zoom + props.viewport.position.x}
      cy={(props.rectangle.y + props.rectangle.height / 2) * props.viewport.zoom + props.viewport.position.y}
      rx={(props.rectangle.width / 2) * props.viewport.zoom}
      ry={(props.rectangle.height / 2) * props.viewport.zoom}
      fill={props.fillColor ? rgbaToRgbaString(props.fillColor) : undefined}
      stroke={props.stroke ? rgbaToRgbaString(props.stroke.color) : undefined}
      stroke-width={props.stroke ? props.stroke.width * props.viewport.zoom : undefined}
    />
  );
};
