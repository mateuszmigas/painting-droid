/* @jsxImportSource solid-js */
import type { Rectangle } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";
import { createSignal, createEffect, onCleanup } from "solid-js";

export type ImageRectangleProps = {
  rectangle: Rectangle;
  blob?: Blob;
};

export const ImageRectangle = (
  props: ImageRectangleProps & { viewport: Viewport }
) => {
  const [src, setSrc] = createSignal("");
  createEffect(() => {
    if (!props.blob) {
      setSrc("");
      return;
    }

    const objectUrl = URL.createObjectURL(props.blob);
    setSrc(objectUrl);
    onCleanup(() => URL.revokeObjectURL(objectUrl));
  });

  return (
    <image
      class="pixelated-canvas"
      x={props.rectangle.x * props.viewport.zoom + props.viewport.position.x}
      y={props.rectangle.y * props.viewport.zoom + props.viewport.position.y}
      width={props.rectangle.width * props.viewport.zoom}
      height={props.rectangle.height * props.viewport.zoom}
      preserveAspectRatio="none"
      href={src()}
    />
  );
};
