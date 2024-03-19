import {
  useCanvasActionDispatcher,
  useCanvasContextGuard,
  useDrawTool,
  useListener,
  useShapeRenderer,
  useShapeTool,
  useSyncCanvasStackWithLayers,
  useViewportManipulator,
} from "@/hooks";
import { useToolStore } from "@/store/toolState";
import {
  activeWorkspaceCanvasDataSelector,
  useWorkspacesStore,
} from "@/store/workspacesStore";
import { isDrawTool, isShapeTool } from "@/tools";
import type { DrawToolId } from "@/tools/draw-tools";
import type { Size } from "@/utils/common";
import { type Viewport, screenToViewportPosition } from "@/utils/manipulation";
import type { Observable } from "@/utils/observable";
import React, { memo, useRef, useEffect } from "react";

const alphaGridCellSize = 20;
const applyTransform = (
  viewport: Viewport,
  size: Size,
  parentElement: HTMLElement,
  canvasStack: HTMLCanvasElement[]
) => {
  parentElement.style.transform = `translate(${viewport.position.x}px, ${viewport.position.y}px)`;
  parentElement.style.width = `${size.width * viewport.zoom}px`;
  parentElement.style.height = `${size.height * viewport.zoom}px`;

  canvasStack.forEach((element) => {
    element.style.transform = `scale(${viewport.zoom})`;
  });
};

export const CanvasViewport = memo(
  (props: { viewport: Observable<Viewport>; size: Size }) => {
    const { viewport, size } = props;
    const hostElementRef = useRef<HTMLDivElement>(null);
    const canvasParentRef = useRef<HTMLDivElement>(null);
    const canvasStackRef = useRef<HTMLCanvasElement[]>([]);
    const overlayHostRef = useRef<HTMLDivElement>(null);
    const { layers, activeLayerIndex, overlayShape } = useWorkspacesStore(
      activeWorkspaceCanvasDataSelector
    );
    const { contexts } = useSyncCanvasStackWithLayers(canvasStackRef, layers);
    const activeContext = contexts?.[activeLayerIndex];
    const contextGuard = useCanvasContextGuard(
      activeContext!,
      layers[activeLayerIndex]
    );
    const toolId = useToolStore((state) => state.selectedToolId);
    const toolSettings = useToolStore((state) => state.toolSettings[toolId]);
    const canvasActionDispatcher = useCanvasActionDispatcher();
    const { render: renderShape } = useShapeRenderer(viewport, overlayHostRef);

    useEffect(() => {
      renderShape(overlayShape);
    }, [renderShape, overlayShape]);

    useShapeTool(
      hostElementRef,
      "rectangleSelect",
      (position) => screenToViewportPosition(position, viewport.getValue()),
      () => overlayShape,
      renderShape,
      (overlayShape, operation) => {
        if (overlayShape === null) {
          operation === "deselect" &&
            canvasActionDispatcher.execute("clearOverlayShape", undefined);
        } else {
          operation === "draw" &&
            canvasActionDispatcher.execute("drawOverlayShape", {
              overlayShape,
            });
          operation === "transform" &&
            canvasActionDispatcher.execute("transformOverlayShape", {
              overlayShape,
            });
        }
      },
      isShapeTool(toolId)
    );

    useDrawTool(
      hostElementRef,
      toolId as DrawToolId,
      toolSettings,
      (position) => screenToViewportPosition(position, viewport.getValue()),
      contextGuard,
      isDrawTool(toolId) && !!activeContext && contexts !== null
    );

    useViewportManipulator(
      hostElementRef,
      () => viewport.getValue(),
      (newViewport) => viewport.setValue(newViewport)
    );

    useListener(
      viewport,
      (newViewport) =>
        canvasParentRef.current &&
        applyTransform(
          newViewport,
          size,
          canvasParentRef.current,
          canvasStackRef.current
        ),
      { triggerOnMount: true }
    );

    return (
      <div
        ref={hostElementRef}
        style={{ opacity: contexts !== null ? "1" : "0" }}
        className="absolute size-full overflow-hidden cursor-crosshair duration-1000"
      >
        <div
          ref={canvasParentRef}
          style={
            {
              "--alpha-background-size": `${alphaGridCellSize}px`,
            } as never
          }
          className="relative pointer-events-none outline outline-border shadow-2xl box-content alpha-background"
        >
          {layers.map((layer, index) => (
            <React.Fragment key={layer.id}>
              <canvas
                ref={(element) => {
                  if (element) {
                    canvasStackRef.current[index] = element;
                  }
                }}
                className="origin-top-left absolute pixelated-canvas"
                style={{ width: size.width, height: size.height }}
                width={size.width}
                height={size.height}
              />
              {/* {index === activeLayerIndex && (
                <OverlayShape viewport={viewport} />
              )} */}
            </React.Fragment>
          ))}
        </div>
        <div
          key="overlay"
          className="size-full absolute pointer-events-none left-0 top-0"
          ref={overlayHostRef}
        />
      </div>
    );
  }
);
