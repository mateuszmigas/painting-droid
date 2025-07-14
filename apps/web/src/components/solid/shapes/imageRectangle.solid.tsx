/* @jsxImportSource solid-js */

import { createMemo, createRenderEffect, createSignal, onCleanup } from "solid-js";
import { ColorProcessor } from "@/utils/colorProcessor";
import type { BoundingBox, Color } from "@/utils/common";
import { cn } from "@/utils/css";
import type { Viewport } from "@/utils/manipulation";

export type ImageRectangleProps = {
  boundingBox: BoundingBox;
  blob?: Blob;
  outlineColor?: Color;
};

export const ImageRectangle = (props: ImageRectangleProps & { viewport: Viewport }) => {
  const [src, setSrc] = createSignal("");
  createRenderEffect(() => {
    if (!props.blob) {
      setSrc("");
      return;
    }

    const objectUrl = URL.createObjectURL(props.blob);
    setSrc(objectUrl);
    onCleanup(() => URL.revokeObjectURL(objectUrl));
  });

  const transform = createMemo(() => {
    const isNegativeWidth = props.boundingBox.width < 0;
    const isNegativeHeight = props.boundingBox.height < 0;

    return `translate(${
      (props.boundingBox.x + (isNegativeWidth ? 0 : 0)) * props.viewport.zoom + props.viewport.position.x
    },${
      (props.boundingBox.y + (isNegativeHeight ? 0 : 0)) * props.viewport.zoom + props.viewport.position.y
    }) scale(${isNegativeWidth ? -1 : 1},${isNegativeHeight ? -1 : 1})`;
  });

  return (
    <image
      style={{
        "--image-outline-color": props.outlineColor
          ? ColorProcessor.fromRgba(props.outlineColor).toRgbString()
          : undefined,
      }}
      class={cn("pixelated-canvas", props.outlineColor && "image-outline")}
      width={Math.abs(props.boundingBox.width) * props.viewport.zoom}
      height={Math.abs(props.boundingBox.height) * props.viewport.zoom}
      preserveAspectRatio="none"
      transform={transform()}
      href={src()}
    />
  );
};
