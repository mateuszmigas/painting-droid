/* @jsxImportSource solid-js */
import { domNames } from "@/constants";
import type { Position } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";
import { TransformGripId, gripSize } from "@/utils/boundingBoxTransform";

export type SelectionGripProps = {
  gripId: TransformGripId;
  position: Position;
};

export const SelectionGrip = (
  props: SelectionGripProps & { viewport: Viewport }
) => {
  return (
    <rect
      class={domNames.svgGripClass}
      data-grip-id={props.gripId}
      transform={`translate(${-gripSize / 2}, ${-gripSize / 2})`}
      x={props.position.x * props.viewport.zoom + props.viewport.position.x}
      y={props.position.y * props.viewport.zoom + props.viewport.position.y}
      width={gripSize}
      height={gripSize}
      fill={"hsl(var(--primary))"}
      stroke={"white"}
      stroke-width={2}
    />
  );
};

