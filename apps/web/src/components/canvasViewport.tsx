import { Viewport, ViewportManipulator } from "@/utils/manipulation";
import { useEffect, useRef } from "react";
import { CanvasHost } from "./canvasHost";

const applyTransform = (viewport: Viewport, element: HTMLElement) => {
  element.style.transform = `
    translate(${viewport.position.x}px, ${viewport.position.y}px) 
    scale(${viewport.zoom})
  `;
};

export const CanvasViewport = () => {
  const hostElement = useRef<HTMLDivElement>(null);
  const viewportElement = useRef<HTMLDivElement>(null);
  const viewport = useRef<Viewport>({
    position: { x: 50, y: 50 },
    zoom: 0.5,
  });

  useEffect(() => {
    if (!hostElement.current || !viewportElement.current) return;
    const manipulator = new ViewportManipulator(
      hostElement.current,
      () => viewport.current,
      (newViewport) => {
        viewport.current = newViewport;
        applyTransform(viewport.current, viewportElement.current!);
      }
    );
    applyTransform(viewport.current, viewportElement.current!);
    return () => manipulator.dispose();
  }, []);

  return (
    <div className="relative size-full">
      <div
        ref={hostElement}
        className="absolute size-full overflow-hidden border "
      >
        <div
          ref={viewportElement}
          className="pointer-events-none origin-top-left"
        >
          <CanvasHost />
        </div>
      </div>
      <div className="absolute p-small">Shift+LMB to move</div>
    </div>
  );
};

