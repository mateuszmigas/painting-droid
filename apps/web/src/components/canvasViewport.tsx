import type { CanvasOverlayShape } from "@/canvas/canvasState";
import { useCanvasPreviewContextStore } from "@/contexts/canvasPreviewContextStore";
import {
  useCanvasActionDispatcher,
  useDrawTool,
  useListener,
  useSyncCanvasVectorContext,
  useShapeTool,
  useStableCallback,
  useSyncCanvasWithLayers,
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
import { memo, useRef, useEffect } from "react";
import {
  createDrawToolHandlers,
  createShapeToolHandlers,
} from "./toolHandlers";
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

const applyCanvasOverlayTransform = (
  canvasOverlay: HTMLCanvasElement | null,
  viewport: Viewport,
  overlayShape: CanvasOverlayShape | null
) => {
  if (!canvasOverlay || !overlayShape?.captured) {
    return;
  }

  canvasOverlay.style.transform = `translate(${
    viewport.position.x + overlayShape.boundingBox.x * viewport.zoom
  }px, ${
    viewport.position.y + overlayShape.boundingBox.y * viewport.zoom
  }px) scale(${viewport.zoom})`;
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
    const canvasOverlayRef = useRef<HTMLCanvasElement>(null);
    const shapeOverlayRef = useRef<HTMLDivElement>(null);
    const { rasterContext, vectorContext, setRasterContext } =
      useCanvasPreviewContextStore();
    const { layers, activeLayerIndex, overlayShape } = useWorkspacesStore(
      activeWorkspaceCanvasDataSelector
    );

    useSyncCanvasVectorContext(shapeOverlayRef, viewport);
    useSyncCanvasWithLayers(
      canvasStackRef,
      canvasOverlayRef,
      layers,
      activeLayerIndex,
      overlayShape,
      (newActiveContext) => {
        setRasterContext(newActiveContext);
        applyCanvasOverlayTransform(
          canvasOverlayRef.current,
          viewport.getValue(),
          overlayShape
        );
      }
    );

    const toolId = useToolStore((state) => state.selectedToolId);
    const toolSettings = useToolStore((state) => state.toolSettings[toolId]);
    const canvasActionDispatcher = useCanvasActionDispatcher();

    const renderShape = useStableCallback(
      (shape: CanvasOverlayShape | null) => {
        vectorContext?.render(shape);
        applyCanvasOverlayTransform(
          canvasOverlayRef.current,
          viewport.getValue(),
          shape
        );
      }
    );

    const applyTransforms = useStableCallback(
      (viewport: Viewport, size: Size) => {
        applyCanvasBackgroundTransform(
          canvasBackgroundRef.current,
          viewport,
          size
        );
        applyCanvasStackTransform(canvasStackRef.current, viewport);
        applyCanvasOverlayTransform(
          canvasOverlayRef.current,
          viewport,
          overlayShape
        );
      }
    );

    useEffect(() => {
      vectorContext?.render(overlayShape);
    }, [vectorContext, overlayShape]);

    useShapeTool(
      hostElementRef,
      "rectangleSelect",
      (position) => screenToViewportPosition(position, viewport.getValue()),
      () => overlayShape,
      createShapeToolHandlers(
        rasterContext,
        renderShape,
        canvasActionDispatcher
      ),
      !isLocked && isShapeTool(toolId)
    );

    useDrawTool(
      hostElementRef,
      toolId as DrawToolId,
      toolSettings,
      rasterContext,
      vectorContext,
      (position) => screenToViewportPosition(position, viewport.getValue()),
      createDrawToolHandlers(
        rasterContext,
        layers[activeLayerIndex],
        canvasActionDispatcher
      ),
      !isLocked && isDrawTool(toolId) && !!rasterContext
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
        style={{ opacity: rasterContext !== null ? "1" : "0" }}
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
        {/* show overlay content of captured data in selected area */}
        <canvas
          className="bg-transparent pixelated-canvas origin-top-left absolute pointer-events-none left-0 top-0"
          ref={canvasOverlayRef}
          style={{
            zIndex: activeLayerIndex + 1,
          }}
        />
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

