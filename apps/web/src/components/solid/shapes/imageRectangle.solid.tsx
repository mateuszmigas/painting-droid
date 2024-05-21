/* @jsxImportSource solid-js */
import type { Rectangle } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";
import { createSignal, createEffect, onCleanup, createMemo } from "solid-js";

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

  const transform = createMemo(() => {
    const isNegativeWidth = props.rectangle.width < 0;
    const isNegativeHeight = props.rectangle.height < 0;

    return `translate(${
      (props.rectangle.x + (isNegativeWidth ? 0 : 0)) * props.viewport.zoom +
      props.viewport.position.x
    },${
      (props.rectangle.y + (isNegativeHeight ? 0 : 0)) * props.viewport.zoom +
      props.viewport.position.y
    }) scale(${isNegativeWidth ? -1 : 1},${isNegativeHeight ? -1 : 1})`;
  });

  return (
    <image
      class="pixelated-canvas"
      width={Math.abs(props.rectangle.width) * props.viewport.zoom}
      height={Math.abs(props.rectangle.height) * props.viewport.zoom}
      preserveAspectRatio="none"
      transform={transform()}
      href={src()}
    />
  );
};
