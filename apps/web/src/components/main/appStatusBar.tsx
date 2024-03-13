import {
  activeWorkspaceSelector,
  useWorkspacesStore,
} from "@/store/workspacesStore";
import { Icon } from "../icon";
import type { Position } from "@/utils/common";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { useMousePosition } from "@/hooks";
import { memo, useRef } from "react";
import { screenToViewportPosition } from "@/utils/manipulation";
import { fastRound } from "@/utils/math";

const formatPosition = (position: Position) =>
  `${fastRound(position.x)}, ${fastRound(position.y)}`;
const formatSize = (size: { width: number; height: number }) =>
  `${size.width}x${size.height}`;

export const AppStatusBar = memo(() => {
  const positionElementRef = useRef<HTMLDivElement>(null);
  const workspaceElementPositionRef = useRef<Position>({ x: 0, y: 0 });
  const size = useWorkspacesStore(
    (state) => activeWorkspaceSelector(state).size
  );
  const viewport = useWorkspacesStore(
    (state) => activeWorkspaceSelector(state).viewport
  );

  useResizeObserver("workspace-viewport", ({ x, y }) => {
    workspaceElementPositionRef.current = { x, y };
  });

  useMousePosition((position) => {
    if (positionElementRef.current && viewport) {
      const canvasPosition = {
        x: position.x - workspaceElementPositionRef.current.x,
        y: position.y - workspaceElementPositionRef.current.y,
      };
      positionElementRef.current.textContent = formatPosition(
        screenToViewportPosition(canvasPosition, viewport)
      );
    }
  });

  return (
    <div className="px-2 h-[28px] border-t bg-secondary flex flex-row items-center gap-[20px]">
      <div className="flex flex-row items-center gap-small">
        <Icon type="square" size="small" />
        <div className="text-xs">{formatSize(size)}</div>
      </div>
      <div className="flex flex-row items-center gap-small">
        <Icon type="mouse-pointer-square" size="small" />
        <div ref={positionElementRef} className="text-xs" />
      </div>
    </div>
  );
});

