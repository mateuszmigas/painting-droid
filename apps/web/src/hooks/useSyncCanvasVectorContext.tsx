import type { CanvasCapturedArea } from "@/canvas/canvasState";
import type { Viewport } from "@/utils/manipulation";
import type { Observable } from "@/utils/observable";
import { type RefObject, useEffect, useMemo } from "react";
import { useListener } from ".";
import { createComponent, render } from "solid-js/web";
import { createStore } from "solid-js/store";
import { VectorCanvas } from "../components/solid/vectorCanvas.solid";
import { useCanvasContextStore } from "@/contexts/canvasContextStore";
import type { CanvasShape } from "@/components/solid/shapes/shape.solid";

export const useSyncCanvasVectorContext = (
  elementRef: RefObject<HTMLElement>,
  viewport: Observable<Viewport>
) => {
  const { setVectorContext } = useCanvasContextStore();
  const [getStore, setStore] = useMemo(
    () =>
      createStore<{
        capturedArea: CanvasCapturedArea | null;
        shapes: CanvasShape[];
        viewport: Viewport;
      }>({ capturedArea: null, shapes: [], viewport: viewport.getValue() }),
    [viewport]
  );

  useEffect(() => {
    if (!elementRef.current) return;
    const unmount = render(
      () => createComponent(VectorCanvas as never, getStore),
      elementRef.current
    );
    setVectorContext({
      renderCapturedArea: (area: CanvasCapturedArea | null) =>
        setStore("capturedArea", area ? { ...area } : null),
      renderShapes: (shapes: CanvasShape[]) => {
        setStore("shapes", shapes);
      },
    });
    return () => {
      unmount();
    };
  }, [getStore, setStore, setVectorContext, elementRef.current]);

  useListener(viewport, (viewport) => setStore("viewport", viewport));
};

