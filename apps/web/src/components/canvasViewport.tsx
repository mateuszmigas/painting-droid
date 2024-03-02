import {
  Viewport,
  ViewportManipulator,
  defaultViewport,
  calculateFitViewport,
} from "@/utils/manipulation";
import { useLayoutEffect, useRef } from "react";
import { CanvasHost } from "./canvasHost";

const applyTransform = (viewport: Viewport, element: HTMLElement) => {
  element.style.transform = `
    translate(${viewport.position.x}px, ${viewport.position.y}px) 
    scale(${viewport.zoom})
  `;
};

export const CanvasViewport = () => {
  const hostElementRef = useRef<HTMLDivElement>(null);
  const viewportElementRef = useRef<HTMLDivElement>(null);
  const canvasSize = { width: 800, height: 600 };
  const viewport = useRef<Viewport | null>(null);

  useLayoutEffect(() => {
    if (!hostElementRef.current || !viewportElementRef.current) return;

    const hostElement = hostElementRef.current;
    const viewportElement = viewportElementRef.current;
    const manipulator = new ViewportManipulator(
      hostElement,
      () => viewport.current ?? defaultViewport,
      (newViewport) => {
        viewport.current = newViewport;
        applyTransform(viewport.current, viewportElement!);
      }
    );

    setTimeout(() => {
      viewport.current = calculateFitViewport(
        hostElement.getBoundingClientRect(),
        { x: 0, y: 0, ...canvasSize },
        50
      );
      applyTransform(viewport.current, viewportElement!);
      viewportElement.classList.remove("hidden");
    }, 0);

    return () => manipulator.dispose();
  }, []);

  return (
    <div className="relative size-full">
      <div ref={hostElementRef} className="absolute size-full overflow-hidden">
        <div
          ref={viewportElementRef}
          className="pointer-events-none origin-top-left hidden shadow-sm"
        >
          <CanvasHost size={canvasSize} />
        </div>
      </div>
      <div className="absolute p-small">Middle mouse to move/zoom</div>
    </div>
  );
};

