import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SelectToolPanel } from "./panels/selectToolPanel";
import { ColorsPanel } from "./panels/colorsPanel";

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

const MiddleContent = () => {
  return <div className="p-2">Canvas</div>;
};

const RightContent = () => {
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel>
        <div className="p-2">Layers</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="p-2">History</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="p-2">Metadata</div>
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
        <MiddleContent />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={20}>
        <RightContent />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

