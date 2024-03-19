import type { CanvasOverlayShape } from "@/canvas/canvasState";
import type { Viewport } from "@/utils/manipulation";
import type { Observable } from "@/utils/observable";
import { type RefObject, useEffect, useMemo } from "react";
import { useListener } from ".";
import { createComponent, render } from "solid-js/web";
import { createStore } from "solid-js/store";
import { OverlayShape } from "../components/solid/overlayShape.solid";

export const useShapeRenderer = (
  viewport: Observable<Viewport>,
  elementRef: RefObject<HTMLElement>
) => {
  const [getStore, setStore] = useMemo(
    () =>
      createStore<{
        overlayShape: CanvasOverlayShape | null;
        viewport: Viewport;
      }>({ overlayShape: null, viewport: viewport.getValue() }),
    [viewport]
  );

  useEffect(() => {
    if (!elementRef.current) return;
    const unmount = render(
      () => createComponent(OverlayShape as never, getStore),
      elementRef.current
    );
    return () => {
      unmount();
    };
  }, [getStore, elementRef.current]);

  useListener(viewport, (viewport) => setStore("viewport", viewport));

  return {
    render: (shape: CanvasOverlayShape | null) => {
      return setStore("overlayShape", shape ? { ...shape } : null);
    },
  };
};
