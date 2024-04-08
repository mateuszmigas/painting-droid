import {
  activeWorkspaceCanvasDataSelector,
  activeWorkspaceSelector,
  useWorkspacesStore,
} from "@/store/workspacesStore";
import { Icon } from "../icons/icon";
import type { Position } from "@/utils/common";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { useListener } from "@/hooks";
import { memo, useEffect, useRef, useState } from "react";
import { screenToViewportPosition } from "@/utils/manipulation";
import { fastRound } from "@/utils/math";
import { CommandIconButton } from "../commandIconButton";
import { domNames } from "@/contants";
import { observableMousePosition } from "@/utils/mousePositionWatcher";
import { Button } from "../ui/button";
import { type Update, checkForUpdates } from "@/utils/updater";
import { isWeb } from "@/utils/platform";
import { getTranslations } from "@/translations";

const translations = getTranslations();

const formatPosition = (position: Position) =>
  `${fastRound(position.x)}, ${fastRound(position.y)}`;
const formatSize = (size: { width: number; height: number }) =>
  `${size.width}x${size.height}`;

export const AppStatusBar = memo(() => {
  const positionElementRef = useRef<HTMLDivElement>(null);
  const workspaceElementPositionRef = useRef<Position>({ x: 0, y: 0 });
  const size = useWorkspacesStore(
    (state) => activeWorkspaceCanvasDataSelector(state).size
  );
  const [update, setUpdate] = useState<Update | null>(null);
  const [updateState, setUpdateState] = useState<
    "checking" | "available" | "downloading" | "finished"
  >("checking");
  const viewport = useWorkspacesStore(
    (state) => activeWorkspaceSelector(state).viewport
  );

  useResizeObserver(domNames.workspaceViewport, ({ x, y }) => {
    workspaceElementPositionRef.current = { x, y };
  });

  useEffect(() => {
    if (isWeb()) {
      return;
    }
    checkForUpdates().then((update) => {
      if (update) {
        setUpdate(update);
        setUpdateState("available");
      }
    });
  }, []);

  useListener(observableMousePosition, (position) => {
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
    <div className="px-2 h-[28px] border-t bg-secondary flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-[20px]">
        <div className="flex flex-row items-center gap-small">
          <Icon type="square" size="small" />
          <div className="text-xs">{formatSize(size)}</div>
        </div>
        <div className="flex flex-row items-center gap-small">
          <Icon type="mouse-pointer-square" size="small" />
          <div ref={positionElementRef} className="text-xs" />
        </div>
      </div>
      <div className="flex flex-row items-center gap-small">
        {updateState === "downloading" && (
          <div className="flex flex-row items-center gap-very-small">
            <div className="text-xs">{translations.updater.downloading}</div>
            <Icon className="ml-2 animate-spin" type="loader" size="small" />
          </div>
        )}
        {updateState === "available" && update && (
          <Button
            className="h-[18px] px-medium"
            variant="default"
            onClick={async () => {
              setUpdateState("downloading");
              await update.downloadAndInstall();
              setUpdateState("finished");
            }}
          >
            {translations.updater.available}: v{update.version}
          </Button>
        )}
        {updateState === "finished" && update && (
          <Button
            className="h-[18px] px-medium"
            variant="default"
            onClick={() => update.restart()}
          >
            {translations.updater.installedAndRestart}
          </Button>
        )}
        <CommandIconButton commandId="fitCanvasToWindow" />
      </div>
    </div>
  );
});
