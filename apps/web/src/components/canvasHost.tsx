import {
  ImageUncompressedRegionRect,
  ImageUncompressedData,
} from "@/utils/imageData";
import { Size } from "@/utils/common";
import { useLayoutEffect, useRef } from "react";

export type CanvasHostProps = {
  imageData: ImageUncompressedData;
  overlayRegions: ImageUncompressedRegionRect[];
};

export const CanvasHost2 = (props: { size: Size }) => {
  const { size } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    const image = new Image();
    image.onload = () => context.drawImage(image, 0, 0);
    image.src = "/logo.png";

    context.font = "30px Arial";
    context.fillText("Hello, World!", 300, 400);
  }, []);

  const { width, height } = size;
  return (
    <div className="bg-gray-100" style={{ width, height }}>
      <canvas
        className="pixelated-canvas"
        ref={canvasRef}
        width={width}
        height={height}
      ></canvas>
    </div>
  );
};
