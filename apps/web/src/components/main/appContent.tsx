import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { SelectToolPanel } from "../panels/selectToolPanel";
import { ColorsPanel } from "../panels/colorsPanel";
import { LayersPanel } from "../panels/layersPanel";
import { HistoryPanel } from "../panels/historyPanel";
import { MetadataPanel } from "../panels/metadataPanel";
import { WorkspaceViewport } from "../workspaceViewport";
import { ToolSettingsBar } from "../toolSettingsBar";

const LeftContent = () => {
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel>
        <SelectToolPanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30}>
        <ColorsPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

const RightContent = () => {
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel>
        <LayersPanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <HistoryPanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <MetadataPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export const AppContent = () => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20}>
        <LeftContent />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <>
          <ToolSettingsBar />
          <WorkspaceViewport />
        </>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={20}>
        <RightContent />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
