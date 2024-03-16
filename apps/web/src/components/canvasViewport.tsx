import { memo, useRef } from "react";
import {
  useViewportManipulator,
  useListener,
  useDrawTool,
  useSyncCanvasStackWithLayers,
  useCanvasContextGuard,
} from "@/hooks";
import { useToolStore } from "@/store/toolState";
import type { Observable } from "@/utils/observable";
import {
  activeWorkspaceCanvasDataSelector,
  useWorkspacesStore,
} from "@/store/workspacesStore";
import { screenToViewportPosition, type Viewport } from "@/utils/manipulation";
import type { Size } from "@/utils/common";
import { useSyncSvgWithOverlayShape } from "@/hooks/useSyncSvgWithOverlayShapes";
import React from "react";
import type { DrawToolId } from "@/tools/draw-tools";
import { isDrawTool } from "@/tools";

const alphaGridCellSize = 20;
const applyTransform = (viewport: Viewport, element: HTMLElement) => {
  element.style.transform = `
      translate(${viewport.position.x}px, ${viewport.position.y}px) 
      scale(${viewport.zoom})
    `;
  element.style.setProperty(
    "--alpha-background-size",
    `${alphaGridCellSize / viewport.zoom}px`
  );
};

export const CanvasViewport = memo(
  (props: { viewport: Observable<Viewport>; size: Size }) => {
    const { viewport, size } = props;
    const hostElementRef = useRef<HTMLDivElement>(null);
    const canvasParentRef = useRef<HTMLDivElement>(null);
    const canvasStackRef = useRef<HTMLCanvasElement[]>([]);
    const svgElementRef = useRef<SVGSVGElement | null>(null);
    const { layers, overlayShape, activeLayerIndex } = useWorkspacesStore(
      activeWorkspaceCanvasDataSelector
    );
    useSyncSvgWithOverlayShape(svgElementRef, overlayShape);
    const { contexts } = useSyncCanvasStackWithLayers(canvasStackRef, layers);
    const activeContext = contexts?.[activeLayerIndex];
    const contextGuard = useCanvasContextGuard(
      activeContext!,
      layers[activeLayerIndex]
    );
    const toolId = useToolStore((state) => state.selectedToolId);
    const toolSettings = useToolStore((state) => state.toolSettings[toolId]);

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
        applyTransform(newViewport, canvasParentRef.current),
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
          style={{ width: size.width, height: size.height }}
          className="relative pointer-events-none origin-top-left outline outline-border shadow-2xl box-content alpha-background"
        >
          {layers.map((layer, index) => (
            <React.Fragment key={layer.id}>
              <canvas
                ref={(element) => {
                  if (element) {
                    canvasStackRef.current[index] = element;
                  }
                }}
                className="absolute pixelated-canvas"
                style={{ width: size.width, height: size.height }}
                width={size.width}
                height={size.height}
              />
              {index === activeLayerIndex && (
                <svg
                  ref={svgElementRef}
                  className="absolute pointer-events-none"
                  style={{ width: size.width, height: size.height }}
                  width={size.width}
                  height={size.height}
                />
              )}
            </React.Fragment>
          ))}
          <div key="canvas-manipulators" />
        </div>
      </div>
    );
  }
);
