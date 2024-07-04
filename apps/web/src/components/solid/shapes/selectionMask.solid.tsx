/* @jsxImportSource solid-js */
import { ImageMaskData } from "@/utils/imageMask";
import { ImageProcessor } from "@/utils/imageProcessor";
import type { Viewport } from "@/utils/manipulation";
import { createRenderEffect, createSignal } from "solid-js";

export type SelectionMaskProps = {
  mask: ImageMaskData;
  actions?: { display: string; callback: () => void }[];
};

export const SelectionMask = (
  props: SelectionMaskProps & { viewport: Viewport }
) => {
  console.log(props.mask);
  const [src, setSrc] = createSignal("");

  createRenderEffect(() => {
    const width = 1024;
    const height = 1024;

    console.time("mask");
    const clone = props.mask.slice();
    const imageData = new Uint8ClampedArray(width * height * 4);

    for (let i = 0; i < clone.length; i++) {
      const pixelIndex = i * 4;
      imageData[pixelIndex] = 0;
      imageData[pixelIndex + 1] = 0;
      imageData[pixelIndex + 2] = 255;
      imageData[pixelIndex + 3] = clone[i] * 125;
    }

    ImageProcessor.fromUncompressed({
      width,
      height,
      data: imageData,
    })
      .toBlob()
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
        console.timeEnd("mask");
      });
    // onCleanup(() => URL.revokeObjectURL(objectUrl));
  });

  return (
    <>
      <image
        class="pixelated-canvas"
        x={props.viewport.position.x}
        y={props.viewport.position.y}
        width={1024 * props.viewport.zoom}
        height={1024 * props.viewport.zoom}
        href={src()}
      />
    </>
  );
};

