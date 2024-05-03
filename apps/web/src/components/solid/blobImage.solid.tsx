/* @jsxImportSource solid-js */
import { createEffect, createSignal, onCleanup } from "solid-js";

export const BlobImage = (props: { blob?: Blob }) => {
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

  return <img class="absolute pixelated-canvas size-full" src={src()} alt="" />;
};

