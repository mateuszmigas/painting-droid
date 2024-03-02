import { useLayoutEffect, useRef } from "react";

export const CanvasHost = () => {
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

  return (
    <div className="bg-gray-100" style={{ width: 800, height: 600 }}>
      <canvas ref={canvasRef} width={800} height={600}></canvas>
    </div>
  );
};

