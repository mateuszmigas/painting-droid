import { memo, useRef } from "react";
import {
  useViewportManipulator,
  useListener,
  useDrawTool,
  useSyncCanvasWithLayers,
  useCanvasContextDispatcher,
} from "@/hooks";
import { useToolStore } from "@/store/toolState";
import type { Observable } from "@/utils/observable";
import {
  activeWorkspaceCanvasDataSelector,
  useWorkspacesStore,
  type WorkspaceId,
} from "@/store/workspacesStore";
import { screenToViewportPosition, type Viewport } from "@/utils/manipulation";
import type { Size } from "@/utils/common";

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
  (props: {
    workspaceId: WorkspaceId;
    viewport: Observable<Viewport>;
    size: Size;
  }) => {
    const { viewport, size } = props;
    const hostElementRef = useRef<HTMLDivElement>(null);
    const canvasParentRef = useRef<HTMLDivElement>(null);
    const canvasElementsRef = useRef<HTMLCanvasElement[]>([]);
    const { layers, activeLayerIndex } = useWorkspacesStore(
      activeWorkspaceCanvasDataSelector
    );

    const { contexts } = useSyncCanvasWithLayers(canvasElementsRef, layers);
    const activeContext = contexts?.[activeLayerIndex];
    const dispatcher = useCanvasContextDispatcher(
      activeContext!,
      layers[activeLayerIndex]
    );
    const toolId = useToolStore((state) => state.selectedToolId);
    const toolSettings = useToolStore((state) => state.toolSettings[toolId]);

    useDrawTool(
      hostElementRef,
      toolId,
      toolSettings,
      (position) => screenToViewportPosition(position, viewport.getValue()),
      dispatcher,
      !!activeContext && contexts !== null
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
            <canvas
              ref={(element) => {
                if (element) {
                  canvasElementsRef.current[index] = element;
                }
              }}
              key={layer.id}
              className="absolute pixelated-canvas"
              style={{ width: size.width, height: size.height }}
              width={size.width}
              height={size.height}
            />
          ))}
        </div>
      </div>
    );
  }
);
