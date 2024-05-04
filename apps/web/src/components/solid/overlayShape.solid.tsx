/* @jsxImportSource solid-js */
import * as Solid from "solid-js";
import type { CanvasOverlayShape } from "@/canvas/canvasState";
import type { Viewport } from "@/utils/manipulation";
import { BlobImage } from "./blobImage.solid";

export const OverlayShape = (props: {
  overlayShape: CanvasOverlayShape | null;
  viewport: Viewport;
}) => {
  return (
    <Solid.Show when={!!props.overlayShape}>
      <div
        style={{
          left: `${
            props.overlayShape!.boundingBox.x * props.viewport.zoom +
            props.viewport.position.x
          }px`,
          top: `${
            props.overlayShape!.boundingBox.y * props.viewport.zoom +
            props.viewport.position.y
          }px`,
          width: `${
            props.overlayShape!.boundingBox.width * props.viewport.zoom
          }px`,
          height: `${
            props.overlayShape!.boundingBox.height * props.viewport.zoom
          }px`,
        }}
        class="absolute border-primary border-2 border-dashed"
      >
        {/* <Solid.Show when={!!props.overlayShape!.captured}>
          <BlobImage blob={props.overlayShape!.captured?.data} />
        </Solid.Show> */}
      </div>
    </Solid.Show>
  );
};

