/* @jsxImportSource solid-js */
import { gripSize } from "@/utils/boundingBoxTransform";
import type { Rectangle } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";
import { Show } from "solid-js";

export type SelectionRectangleProps = {
  rectangle: Rectangle;
  actions?: { display: string; callback: () => void }[];
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
        stroke={"hsl(var(--primary))"}
      />
      <rect
        x={props.rectangle.x * props.viewport.zoom + props.viewport.position.x}
        y={props.rectangle.y * props.viewport.zoom + props.viewport.position.y}
        width={props.rectangle.width * props.viewport.zoom}
        height={props.rectangle.height * props.viewport.zoom}
        fill="transparent"
        stroke-width={2}
        style={{ cursor: "move" }}
        stroke={"white"}
        stroke-dasharray={"10"}
      />

      <Show when={props.actions}>
        <foreignObject
          x={
            props.rectangle.x * props.viewport.zoom + props.viewport.position.x
          }
          y={
            (props.rectangle.y + props.rectangle.height + gripSize) *
              props.viewport.zoom +
            props.viewport.position.y
          }
          width={props.rectangle.width * props.viewport.zoom}
          class="h-input-thin text-center space-x-1"
        >
          {props.actions!.map((action) => (
            <button
              ref={(event) =>
                event.addEventListener("pointerdown", (e) =>
                  e.stopPropagation()
                )
              }
              class="fixed -translate-x-1/2 bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-sm px-small"
              onClick={action.callback}
            >
              {action.display}
            </button>
          ))}
        </foreignObject>
      </Show>
    </>
  );
};
