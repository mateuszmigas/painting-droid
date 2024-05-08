/* @jsxImportSource solid-js */
import * as Solid from "solid-js";
import type { CanvasCapturedArea } from "@/canvas/canvasState";
import type { Viewport } from "@/utils/manipulation";
import { BlobImage } from "./blobImage.solid";

export const VectorCanvas = (props: {
  capturedArea: CanvasCapturedArea | null;
  viewport: Viewport;
}) => {
  return (
    <Solid.Show when={!!props.capturedArea}>
      <div
        style={{
          left: `${
            props.capturedArea!.boundingBox.x * props.viewport.zoom +
            props.viewport.position.x
          }px`,
          top: `${
            props.capturedArea!.boundingBox.y * props.viewport.zoom +
            props.viewport.position.y
          }px`,
          width: `${
            props.capturedArea!.boundingBox.width * props.viewport.zoom
          }px`,
          height: `${
            props.capturedArea!.boundingBox.height * props.viewport.zoom
          }px`,
        }}
        class="absolute"
      >
        <Solid.Show when={!!props.capturedArea!.captured}>
          <BlobImage blob={props.capturedArea!.captured?.data} />
        </Solid.Show>
        <div class="absolute size-full border-primary border-2 border-dashed" />
      </div>
    </Solid.Show>
  );
};

