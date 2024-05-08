/* @jsxImportSource solid-js */
import type { Position } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";

export type SelectionCircleProps = {
  position: Position;
  radius: number;
};

export const SelectionCircle = (
  props: SelectionCircleProps & { viewport: Viewport }
) => {
  return (
    <>
      <circle
        cx={props.position.x * props.viewport.zoom + props.viewport.position.x}
        cy={props.position.y * props.viewport.zoom + props.viewport.position.y}
        r={props.radius * props.viewport.zoom}
        fill="transparent"
        stroke={"black"}
      />
      <circle
        cx={props.position.x * props.viewport.zoom + props.viewport.position.x}
        cy={props.position.y * props.viewport.zoom + props.viewport.position.y}
        r={props.radius * props.viewport.zoom}
        fill="transparent"
        stroke={"white"}
        stroke-dasharray={"10"}
      />
    </>
  );
};

