import { useCanvasContextStore } from "@/contexts/canvasContextStore";
import {
  useTool,
  useListener,
  useSyncCanvasVectorContext,
  useStableCallback,
  useSyncCanvasWithLayers,
  useViewportManipulator,
} from "@/hooks";
import { useToolStore } from "@/store/toolState";
import {
  activeWorkspaceCanvasDataSelector,
  useWorkspacesStore,
} from "@/store/workspacesStore";
import type { CanvasToolId } from "@/tools/draw-tools";
import type { Size } from "@/utils/common";
import { type Viewport, screenToViewportPosition } from "@/utils/manipulation";
import type { Observable } from "@/utils/observable";
import { memo, useRef, useEffect } from "react";
import { domNames } from "@/constants";
import { testIds } from "@/utils/testIds";

const alphaGridCellSize = 20;

const applyCanvasBackgroundTransform = (
  canvasBackground: HTMLElement | null,
  viewport: Viewport,
  size: Size
) => {
  if (!canvasBackground) {
    return;
  }
  canvasBackground.style.transform = `translate(${viewport.position.x}px, ${viewport.position.y}px)`;
  canvasBackground.style.width = `${size.width * viewport.zoom}px`;
  canvasBackground.style.height = `${size.height * viewport.zoom}px`;
};

const applyCanvasStackTransform = (
  canvasStack: HTMLCanvasElement[],
  viewport: Viewport
) => {
  canvasStack.forEach((element) => {
    element.style.transform = `translate(${viewport.position.x}px, ${viewport.position.y}px) scale(${viewport.zoom})`;
  });
};

const createCanvasKey = (layerId: string, size: Size) =>
  `canvas-${layerId}-${size.width}-${size.height}`;

export const CanvasViewport = memo(
  (props: {
    viewport: Observable<Viewport>;
    size: Size;
    isLocked: boolean;
  }) => {
    const { viewport, size, isLocked } = props;
    const hostElementRef = useRef<HTMLDivElement>(null);
    const canvasBackgroundRef = useRef<HTMLDivElement>(null);
    const canvasStackRef = useRef<HTMLCanvasElement[]>([]);
    const shapeOverlayRef = useRef<HTMLDivElement>(null);
    const { context } = useCanvasContextStore();
    const { layers, activeLayerIndex, overlayShape } = useWorkspacesStore(
      activeWorkspaceCanvasDataSelector
    );

    useSyncCanvasVectorContext(shapeOverlayRef, viewport);
    useSyncCanvasWithLayers(
      canvasStackRef,
      layers,
      activeLayerIndex,
      overlayShape
    );

    const toolId = useToolStore((state) => state.selectedToolId);
    const toolSettings = useToolStore((state) => state.toolSettings[toolId]);

    const applyTransforms = useStableCallback(
      (viewport: Viewport, size: Size) => {
        applyCanvasBackgroundTransform(
          canvasBackgroundRef.current,
          viewport,
          size
        );
        applyCanvasStackTransform(canvasStackRef.current, viewport);
      }
    );

    //sync shape overlay
    useEffect(() => {
      context.vector?.render(overlayShape);
    }, [context.vector, overlayShape]);

    useTool(
      hostElementRef,
      toolId as CanvasToolId,
      toolSettings,
      (position) => screenToViewportPosition(position, viewport.getValue()),
      !isLocked
    );

    useViewportManipulator(
      hostElementRef,
      () => viewport.getValue(),
      (newViewport) => viewport.setValue(newViewport)
    );

    useListener(viewport, (newViewport) => applyTransforms(newViewport, size), {
      triggerOnMount: true,
    });

    useEffect(() => {
      applyTransforms(viewport.getValue(), size);
    }, [applyTransforms, size, viewport]);

    const { position, zoom } = viewport.getValue();

    return (
      <div
        ref={hostElementRef}
        style={{ opacity: context.bitmap !== null ? "1" : "0" }}
        className="absolute size-full overflow-hidden cursor-crosshair duration-1000 z-[0]"
      >
        {/* show background */}
        <div
          id={domNames.canvasBackground}
          ref={canvasBackgroundRef}
          style={
            {
              "--alpha-background-size": `${alphaGridCellSize}px`,
            } as never
          }
          className="origin-top-left absolute pointer-events-none outline outline-border shadow-2xl box-content alpha-background"
        />
        {/* show canvas layers */}
        {layers.map((layer, index) => (
          <canvas
            data-testid={testIds.canvasLayer(index)}
            key={createCanvasKey(layer.id, size)}
            ref={(element) => {
              if (element) {
                canvasStackRef.current[index] = element;
              }
            }}
            className="origin-top-left absolute pixelated-canvas pointer-events-none"
            style={{
              width: size.width,
              height: size.height,
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              zIndex: index > activeLayerIndex ? index + 1 : index,
            }}
            width={size.width}
            height={size.height}
          />
        ))}
        {/* show overlay shape, border and handles */}
        <div
          className="size-full origin-top-left absolute pointer-events-none left-0 top-0"
          ref={shapeOverlayRef}
          style={{
            zIndex: layers.length + 1,
          }}
        />
      </div>
    );
  }
);

