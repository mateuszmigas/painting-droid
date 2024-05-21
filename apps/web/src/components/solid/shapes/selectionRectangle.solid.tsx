/* @jsxImportSource solid-js */
import type { Rectangle } from "@/utils/common";
import { normalizeRectangle } from "@/utils/geometry";
import type { Viewport } from "@/utils/manipulation";
import { createMemo } from "solid-js";

export type SelectionRectangleProps = {
  rectangle: Rectangle;
};

export const SelectionRectangle = (
  props: SelectionRectangleProps & { viewport: Viewport }
) => {
  const normalizedRectangle = createMemo(() =>
    normalizeRectangle(props.rectangle)
  );
  return (
    <>
      <rect
        x={
          normalizedRectangle().x * props.viewport.zoom +
          props.viewport.position.x
        }
        y={
          normalizedRectangle().y * props.viewport.zoom +
          props.viewport.position.y
        }
        width={normalizedRectangle().width * props.viewport.zoom}
        height={normalizedRectangle().height * props.viewport.zoom}
        fill="transparent"
        stroke-width={2}
        stroke={"hsl(var(--primary))"}
      />
      <rect
        x={
          normalizedRectangle().x * props.viewport.zoom +
          props.viewport.position.x
        }
        y={
          normalizedRectangle().y * props.viewport.zoom +
          props.viewport.position.y
        }
        width={normalizedRectangle().width * props.viewport.zoom}
        height={normalizedRectangle().height * props.viewport.zoom}
        fill="transparent"
        stroke-width={2}
        stroke={"white"}
        stroke-dasharray={"10"}
      />
    </>
  );
};
