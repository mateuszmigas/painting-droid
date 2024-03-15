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
import { ColorsPanel } from "../panels/colorsPanel";
import type { AppColumnNames, AppPanelNames } from "@/store/layoutStore";
import { translations } from "@/translations";
import { AppColumn } from "./appColumn";
import { useCommandService } from "@/contexts/commandService";
import { useGlobalKeyboardHandler } from "@/hooks";

export const AppContent = () => {
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
    <ResizablePanelGroup direction="horizontal">
      <AppColumn {...createColumnProps("left")}>
        <ResizablePanelGroup direction="vertical">
          <AppEdgePanel {...createPanelProps("tools")}>
            <SelectToolPanel />
          </AppEdgePanel>
          <ResizableHandle />
          <AppEdgePanel {...createPanelProps("colors")}>
            <ColorsPanel />
          </AppEdgePanel>
        </ResizablePanelGroup>
      </AppColumn>
      <ResizableHandle />
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
  );
};
