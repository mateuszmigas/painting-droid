import type { CanvasOverlayShape } from "@/canvas/canvasState";
import type { Viewport } from "@/utils/manipulation";
import type { Observable } from "@/utils/observable";
import { type RefObject, useEffect, useMemo } from "react";
import { useListener } from ".";
import { createComponent, render } from "solid-js/web";
import { createStore } from "solid-js/store";
import { OverlayShape } from "../components/solid/overlayShape.solid";
import { useCanvasPreviewContextStore } from "@/contexts/canvasPreviewContextStore";

export const useSyncCanvasVectorContext = (
  elementRef: RefObject<HTMLElement>,
  viewport: Observable<Viewport>
) => {
  const { setVectorContext } = useCanvasPreviewContextStore();
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
    setVectorContext({
      render: (shape: CanvasOverlayShape | null) =>
        setStore("overlayShape", shape ? { ...shape } : null),
    });
    return () => {
      unmount();
    };
  }, [getStore, elementRef.current]);

  useListener(viewport, (viewport) => setStore("viewport", viewport));
};

