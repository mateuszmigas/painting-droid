import type { CanvasCapturedArea } from "@/canvas/canvasState";
import type { Viewport } from "@/utils/manipulation";
import type { Observable } from "@/utils/observable";
import { type RefObject, useEffect, useMemo } from "react";
import { useListener } from ".";
import { createComponent, render } from "solid-js/web";
import { createStore } from "solid-js/store";
import { VectorCanvas } from "../components/solid/vectorCanvas.solid";
import { useCanvasContextStore } from "@/contexts/canvasContextStore";

export const useSyncCanvasVectorContext = (
  elementRef: RefObject<HTMLElement>,
  viewport: Observable<Viewport>
) => {
  const { setVectorContext } = useCanvasContextStore();
  const [getStore, setStore] = useMemo(
    () =>
      createStore<{
        capturedArea: CanvasCapturedArea | null;
        viewport: Viewport;
      }>({ capturedArea: null, viewport: viewport.getValue() }),
    [viewport]
  );

  useEffect(() => {
    if (!elementRef.current) return;
    const unmount = render(
      () => createComponent(VectorCanvas as never, getStore),
      elementRef.current
    );
    setVectorContext({
      render: (shape: CanvasCapturedArea | null) =>
        setStore("capturedArea", shape ? { ...shape } : null),
    });
    return () => {
      unmount();
    };
  }, [getStore, setStore, setVectorContext, elementRef.current]);

  useListener(viewport, (viewport) => setStore("viewport", viewport));
};

