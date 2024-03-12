import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SelectToolPanel } from "../panels/selectToolPanel";
import { LayersPanel } from "../panels/layersPanel";
import { HistoryPanel } from "../panels/historyPanel";
import { MetadataPanel } from "../panels/metadataPanel";
import { WorkspaceViewport } from "../workspaceViewport";
import { ToolSettingsBar } from "../toolSettingsBar";
import { CollapsibleSidePanel } from "./collapsibleSidePanel";
import { useLayoutStore } from "@/store";
import { ColorsPanel } from "../panels/colorsPanel";
import type { AppColumnNames, AppPanelNames } from "@/store/layoutStore";
import { translations } from "@/translations";

export const AppContent = () => {
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
      defaultSize: columns[name].size,
      onResize: (size: number) => setColumnSize(name, size),
    };
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel {...createColumnProps("left")}>
        <ResizablePanelGroup direction="vertical">
          <CollapsibleSidePanel {...createPanelProps("tools")}>
            <SelectToolPanel />
          </CollapsibleSidePanel>
          <ResizableHandle />
          <CollapsibleSidePanel {...createPanelProps("colors")}>
            <ColorsPanel />
          </CollapsibleSidePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel {...createColumnProps("middle")}>
        <>
          <ToolSettingsBar />
          <WorkspaceViewport />
        </>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel {...createColumnProps("right")}>
        <ResizablePanelGroup direction="vertical">
          <CollapsibleSidePanel {...createPanelProps("layers")}>
            <LayersPanel />
          </CollapsibleSidePanel>
          <ResizableHandle />
          <CollapsibleSidePanel {...createPanelProps("history")}>
            <HistoryPanel />
          </CollapsibleSidePanel>
          <ResizableHandle />
          <CollapsibleSidePanel {...createPanelProps("metadata")}>
            <MetadataPanel />
          </CollapsibleSidePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

