import type { Viewport } from "@/utils/manipulation";
import type { Observable } from "@/utils/observable";
import { type RefObject, useEffect, useMemo } from "react";
import { useListener } from ".";
import { createComponent, render } from "solid-js/web";
import { createStore } from "solid-js/store";
import { VectorCanvas } from "../components/solid/vectorCanvas.solid";
import { useCanvasContextStore } from "@/contexts/canvasContextStore";
import type { Shape2d } from "@/utils/common";

export const useSyncCanvasVectorContext = (
  elementRef: RefObject<HTMLElement>,
  viewport: Observable<Viewport>
) => {
  const { setVectorContext } = useCanvasContextStore();
  const [getStore, setStore] = useMemo(
    () =>
      createStore<{
        shapes?: Record<string, Shape2d[]>;
        viewport: Viewport;
      }>({ shapes: {}, viewport: viewport.getValue() }),
    [viewport]
  );

  useEffect(() => {
    if (!elementRef.current) return;
    const unmount = render(
      () => createComponent(VectorCanvas as never, getStore),
      elementRef.current
    );
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

