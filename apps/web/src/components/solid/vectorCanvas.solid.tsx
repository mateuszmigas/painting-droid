/* @jsxImportSource solid-js */
import * as Solid from "solid-js";
import type { Viewport } from "@/utils/manipulation";
import { Shape, type Shape2d } from "./shapes/shape.solid";

export const VectorCanvas = (props: {
  shapes?: Record<string, Shape2d[]>;
  viewport: Viewport;
}) => {
  return (
    <Solid.Show when={props.shapes}>
      <svg class="absolute size-full">
        <Solid.For each={Object.values(props.shapes!)}>
          {(shapes) => (
            <g>
              <Solid.For each={shapes}>
                {(shape) => <Shape shape={shape} viewport={props.viewport} />}
              </Solid.For>
            </g>
          )}
        </Solid.For>
      </svg>
    </Solid.Show>
  );
};

