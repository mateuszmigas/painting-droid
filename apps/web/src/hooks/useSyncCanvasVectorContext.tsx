import { type RefObject, useEffect, useMemo } from "react";
import { createStore } from "solid-js/store";
import { createComponent, render } from "solid-js/web";
import { useCanvasContextStore } from "@/contexts/canvasContextStore";
import type { Shape2d } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";
import type { Observable } from "@/utils/observable";
import { VectorCanvas } from "../components/solid/vectorCanvas.solid";
import { useListener } from ".";

export const useSyncCanvasVectorContext = (elementRef: RefObject<HTMLElement>, viewport: Observable<Viewport>) => {
  const { setVectorContext } = useCanvasContextStore();
  const [getStore, setStore] = useMemo(
    () =>
      createStore<{
        shapes?: Record<string, Shape2d[]>;
        viewport: Viewport;
      }>({ shapes: {}, viewport: viewport.getValue() }),
    [viewport],
  );

  useEffect(() => {
    if (!elementRef.current) return;
    const unmount = render(() => createComponent(VectorCanvas as never, getStore), elementRef.current);
    setVectorContext({
      render: (groupId: string, shapes: Shape2d[]) => {
        setStore("shapes", { ...getStore.shapes, [groupId]: shapes });
      },
      clear: (groupId: string) => {
        setStore("shapes", { ...getStore.shapes, [groupId]: [] });
      },
    });
    return () => {
      unmount();
    };
  }, [getStore, setStore, setVectorContext, elementRef.current]);

  useListener(viewport, (viewport) => setStore("viewport", viewport));
};
