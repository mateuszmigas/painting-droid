import {
  activeWorkspaceCanvasDataSelector,
  activeWorkspaceSelector,
  useWorkspacesStore,
} from "@/store/workspacesStore";
import { Icon } from "../icons/icon";
import type { Position } from "@/utils/common";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { useIdleCallback, useListener } from "@/hooks";
import { memo, useEffect, useRef, useState } from "react";
import { screenToViewportPosition } from "@/utils/manipulation";
import { fastRound } from "@/utils/math";
import { CommandIconButton } from "../commandIconButton";
import { domNames } from "@/constants";
import { observableMousePosition } from "@/utils/mousePositionWatcher";
import { Button } from "../ui/button";
import { type Update, checkForUpdates } from "@/utils/updater";
import { appVersion, isDesktop, platform } from "@/utils/platform";
import { getTranslations } from "@/translations";
import { useStartupStore } from "@/store/startupStore";
import { notificationService } from "@/contexts/notificationService";
import { useDialogService } from "@/contexts/dialogService";
import { WelcomeDialog } from "../dialogs/welcome-dialog/welcomeDialog";

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
  const { openDialog } = useDialogService();

  useResizeObserver(domNames.workspaceViewport, ({ x, y }) => {
    workspaceElementPositionRef.current = { x, y };
  });

  useEffect(() => {
    if (isDesktop()) {
      checkForUpdates().then((update) => {
        if (update) {
          setUpdate(update);
          setUpdateState("available");
        }
      });
    }
  }, []);

  useIdleCallback(() => {
    const startupStore = useStartupStore.getState();

    if (appVersion() !== startupStore.lastVersion) {
      notificationService.showInfo(
        translations.updater.updatedTo(appVersion())
      );
      startupStore.setCurrentVersion(appVersion());
    }

    if (platform !== "e2e" && !startupStore.welcomeDialogShown) {
      startupStore.setWelcomeDialogShown(true);
      openDialog(WelcomeDialog, {});
    }
  });

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
