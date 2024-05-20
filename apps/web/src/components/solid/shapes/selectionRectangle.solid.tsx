/* @jsxImportSource solid-js */
import type { Rectangle } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";

export type SelectionRectangleProps = {
  rectangle: Rectangle;
};

export const SelectionRectangle = (
  props: SelectionRectangleProps & { viewport: Viewport }
) => {
  return (
    <>
      <rect
        x={props.rectangle.x * props.viewport.zoom + props.viewport.position.x}
        y={props.rectangle.y * props.viewport.zoom + props.viewport.position.y}
        width={props.rectangle.width * props.viewport.zoom}
        height={props.rectangle.height * props.viewport.zoom}
        fill="transparent"
        stroke-width={2}
        stroke={"black"}
      />
      <rect
        x={props.rectangle.x * props.viewport.zoom + props.viewport.position.x}
        y={props.rectangle.y * props.viewport.zoom + props.viewport.position.y}
        width={props.rectangle.width * props.viewport.zoom}
        height={props.rectangle.height * props.viewport.zoom}
        fill="transparent"
        stroke-width={2}
        stroke={"white"}
        stroke-dasharray={"10"}
      />
    </>
  );
};

