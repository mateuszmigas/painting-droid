/* @jsxImportSource solid-js */
import * as Solid from "solid-js";
import type { Viewport } from "@/utils/manipulation";
import { Shape, type Shape2d } from "./shapes/shape.solid";
import { domNames } from "@/constants";
import { TransitionGroup } from "solid-transition-group";

export const VectorCanvas = (props: {
  shapes?: Record<string, Shape2d[]>;
  viewport: Viewport;
}) => {
  return (
    <Solid.Show when={props.shapes}>
      <svg id={domNames.svgHostId} class="absolute size-full">
        <Solid.Index each={Object.values(props.shapes!)}>
          {(shapes) => (
            <g>
              <TransitionGroup
                onEnter={(el, done) => {
                  const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
                    duration: 500,
                  });
                  a.finished.then(done);
                }}
                onExit={(el, done) => {
                  const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
                    duration: 500,
                  });
                  a.finished.then(done);
                }}
              >
                <Solid.Index each={shapes()}>
                  {(shape) => (
                    <Shape shape={shape()} viewport={props.viewport} />
                  )}
                </Solid.Index>
              </TransitionGroup>
            </g>
          )}
        </Solid.Index>
      </svg>
    </Solid.Show>
  );
};
