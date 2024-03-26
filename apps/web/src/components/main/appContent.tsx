import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SelectToolPanel } from "../panels/selectToolPanel";
import { LayersPanel } from "../panels/layersPanel";
import { HistoryPanel } from "../panels/historyPanel";
import { MetadataPanel } from "../panels/metadataPanel";
import { WorkspaceViewport } from "../workspaceViewport";
import { ToolSettingsBar } from "../toolSettingsBar";
import { AppEdgePanel } from "./appEdgePanel";
import { useLayoutStore } from "@/store";
import type { AppColumnNames, AppPanelNames } from "@/store/layoutStore";
import { getTranslations } from "@/translations";
import { AppColumn } from "./appColumn";
import { useCommandService } from "@/contexts/commandService";
import { useGlobalKeyboardHandler } from "@/hooks";
import { memo } from "react";

const translations = getTranslations();

export const AppContent = memo(() => {
  const { executeCommand } = useCommandService();
  useGlobalKeyboardHandler(executeCommand);

  const { panels, columns, setPanelSize, setColumnSize } = useLayoutStore(
    (state) => state
  );

  const createPanelProps = (name: AppPanelNames) => {
    return {
      title: translations.panels[name].title,
      size: panels[name].size,
      onResize: (size: number) => setPanelSize(name, size),
    };
  };

  const createColumnProps = (name: AppColumnNames) => {
    return {
      size: columns[name].size,
      onResize: (size: number) => setColumnSize(name, size),
    };
  };

  return (
    <div className="relative flex flex-row size-full">
      <div className="border-r w-[40px]">
        <SelectToolPanel />
      </div>
      <ResizablePanelGroup className="flex-1" direction="horizontal">
        <AppColumn {...createColumnProps("middle")}>
          <>
            <ToolSettingsBar />
            <WorkspaceViewport />
          </>
        </AppColumn>
        <ResizableHandle />
        <AppColumn {...createColumnProps("right")}>
          <ResizablePanelGroup direction="vertical">
            <AppEdgePanel {...createPanelProps("layers")}>
              <LayersPanel />
            </AppEdgePanel>
            <ResizableHandle />
            <AppEdgePanel {...createPanelProps("history")}>
              <HistoryPanel />
            </AppEdgePanel>
            <ResizableHandle />
            <AppEdgePanel {...createPanelProps("metadata")}>
              <MetadataPanel />
            </AppEdgePanel>
          </ResizablePanelGroup>
        </AppColumn>
      </ResizablePanelGroup>
    </div>
  );
});
