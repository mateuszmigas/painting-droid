import { useState } from "react";

export const ColorWheel = () => {
  const [thumbPosition, setThumbPosition] = useState({ x: 0, y: 0 });
  return (
    <div className="w-32 h-32 relative">
      <div className="absolute wheel-hue size-full" />
      <div className="absolute wheel-saturation size-full" />
      <div className="absolute rounded-full border size-full" />
      <div className="absolute size-full">
        <div className="left-[50px] top-[50px] absolute h-4 w-4 rounded-full border shadow-black/50 border-white shadow transition-colors" />
      </div>
    </div>
  );
};

