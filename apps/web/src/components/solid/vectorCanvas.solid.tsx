/* @jsxImportSource solid-js */
import * as Solid from "solid-js";
import { TransitionGroup } from "solid-transition-group";
import { domNames } from "@/constants";
import type { Viewport } from "@/utils/manipulation";
import { Shape, type Shape2d } from "./shapes/shape.solid";

export const VectorCanvas = (props: { shapes?: Record<string, Shape2d[]>; viewport: Viewport }) => {
  return (
    <Solid.Show when={props.shapes}>
      <svg id={domNames.svgHostId} class="absolute size-full">
        <Solid.Index each={Object.values(props.shapes!)}>
          {(shapes) => (
            <g>
              <TransitionGroup
                onExit={(el, done) => {
                  el.animate([{ opacity: 1 }, { opacity: 0 }], {
                    easing: "ease-in",
                    duration: 250,
                  }).finished.then(done);
                }}
              >
                <Solid.Index each={shapes()}>
                  {(shape) => <Shape shape={shape()} viewport={props.viewport} />}
                </Solid.Index>
              </TransitionGroup>
            </g>
          )}
        </Solid.Index>
      </svg>
    </Solid.Show>
  );
};
