import type { CanvasOverlayShape } from "@/canvas/canvasState";
import { useCanvasPreviewContextStore } from "@/contexts/canvasPreviewContextStore";
import {
  useCanvasActionDispatcher,
  useDrawTool,
  useListener,
  useShapeRenderer,
  useShapeTool,
  useBlobUrl,
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
import type { Rectangle, Size } from "@/utils/common";
import { type Viewport, screenToViewportPosition } from "@/utils/manipulation";
import type { Observable } from "@/utils/observable";
import { memo, useRef, useEffect } from "react";
import {
  createDrawToolHandlers,
  createShapeToolHandlers,
} from "./toolHandlers";

const alphaGridCellSize = 20;

const applyTransform = (
  viewport: Viewport,
  size: Size,
  canvasBackground: HTMLElement,
  canvasStack: HTMLCanvasElement[]
) => {
  canvasBackground.style.transform = `translate(${viewport.position.x}px, ${viewport.position.y}px)`;
  canvasBackground.style.width = `${size.width * viewport.zoom}px`;
  canvasBackground.style.height = `${size.height * viewport.zoom}px`;

  canvasStack.forEach((element) => {
    element.style.transform = `translate(${viewport.position.x}px, ${viewport.position.y}px) scale(${viewport.zoom})`;
  });
};

const applyImageOverlayTransform = (
  image: HTMLImageElement,
  viewport: Viewport,
  boundingBox: Rectangle
) => {
  image.style.transform = `translate(${
    viewport.position.x + boundingBox.x * viewport.zoom
  }px, ${viewport.position.y + boundingBox.y * viewport.zoom}px) scale(${
    viewport.zoom
  })`;

  image.style.maxWidth = `${boundingBox.width}px`;
  image.style.maxHeight = `${boundingBox.height}px`;
};

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
    const imageOverlayRef = useRef<HTMLImageElement>(null);
    const { layers, activeLayerIndex, overlayShape } = useWorkspacesStore(
      activeWorkspaceCanvasDataSelector
    );

    useSyncCanvasWithLayers(canvasStackRef, layers, activeLayerIndex);
    const { previewContext } = useCanvasPreviewContextStore();
    const toolId = useToolStore((state) => state.selectedToolId);
    const toolSettings = useToolStore((state) => state.toolSettings[toolId]);
    const canvasActionDispatcher = useCanvasActionDispatcher();
    const { render } = useShapeRenderer(shapeOverlayRef, viewport);

    const applySelectedImageTransform = useStableCallback(
      (overlayShape: CanvasOverlayShape | null, viewport: Viewport) => {
        imageOverlayRef.current &&
          overlayShape?.captured &&
          applyImageOverlayTransform(
            imageOverlayRef.current,
            viewport,
            overlayShape.boundingBox
          );
      }
    );

    const applyCanvasesTransform = useStableCallback(
      (viewport: Viewport, size: Size) => {
        canvasBackgroundRef.current &&
          applyTransform(
            viewport,
            size,
            canvasBackgroundRef.current,
            canvasStackRef.current
          );
      }
    );

    const renderShape = useStableCallback(
      (shape: CanvasOverlayShape | null) => {
        render(shape);
        shape && applySelectedImageTransform(shape, viewport.getValue());
      }
    );

    useEffect(() => {
      renderShape(overlayShape);
    }, [renderShape, overlayShape]);

    useShapeTool(
      hostElementRef,
      "rectangleSelect",
      (position) => screenToViewportPosition(position, viewport.getValue()),
      () => overlayShape,
      createShapeToolHandlers(
        previewContext,
        renderShape,
        canvasActionDispatcher
      ),
      !isLocked && isShapeTool(toolId)
    );

    useDrawTool(
      hostElementRef,
      toolId as DrawToolId,
      toolSettings,
      previewContext,
      (position) => screenToViewportPosition(position, viewport.getValue()),
      createDrawToolHandlers(
        previewContext,
        layers[activeLayerIndex],
        canvasActionDispatcher
      ),
      !isLocked && isDrawTool(toolId) && !!previewContext
    );

    useViewportManipulator(
      hostElementRef,
      () => viewport.getValue(),
      (newViewport) => viewport.setValue(newViewport)
    );

    useListener(
      viewport,
      (newViewport) => {
        applyCanvasesTransform(newViewport, size);
        applySelectedImageTransform(overlayShape, newViewport);
      },
      { triggerOnMount: true }
    );

    const { position, zoom } = viewport.getValue();

    const imageOverlayUrl = useBlobUrl(overlayShape?.captured?.data.data);

    return (
      <div
        ref={hostElementRef}
        style={{ opacity: previewContext !== null ? "1" : "0" }}
        className="absolute size-full overflow-hidden cursor-crosshair duration-1000 z-[0]"
      >
        <div
          ref={canvasBackgroundRef}
          style={
            {
              "--alpha-background-size": `${alphaGridCellSize}px`,
            } as never
          }
          className="origin-top-left absolute pointer-events-none outline outline-border shadow-2xl box-content alpha-background"
        />
        {layers.map((layer, index) => (
          <canvas
            key={layer.id}
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
        <img
          alt=""
          className="pixelated-canvas origin-top-left absolute pointer-events-none left-0 top-0"
          ref={imageOverlayRef}
          src={imageOverlayUrl}
          style={{
            zIndex: activeLayerIndex + 1,
            willChange: "transform",
            visibility: imageOverlayUrl ? "visible" : "hidden",
          }}
        />
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
