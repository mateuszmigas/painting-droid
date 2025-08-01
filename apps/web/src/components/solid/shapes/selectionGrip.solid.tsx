/* @jsxImportSource solid-js */
import { domNames } from "@/constants";
import { gripSize, type TransformGripId } from "@/utils/boundingBoxTransform";
import type { Position } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";

export type SelectionGripProps = {
  gripId: TransformGripId;
  position: Position;
};

export const SelectionGrip = (props: SelectionGripProps & { viewport: Viewport }) => {
  return (
    <rect
      class={domNames.svgGripClass}
      style={{
        cursor:
          props.gripId === "grip-top-left" || props.gripId === "grip-bottom-right" ? "nwse-resize" : "nesw-resize",
      }}
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
