import { memo } from "react";
import { ResizablePanel } from "@/components/ui/resizable";
import { PanelHeader } from "../panels/panelHeader";

export const AppEdgePanel = memo(
  (props: { title: string; size: number; onResize: (size: number) => void; children: React.ReactNode }) => {
    const { title, size, onResize, children } = props;

    return (
      <>
        <PanelHeader title={title} />
        <ResizablePanel
          defaultSize={`${size}%`}
          onResize={(panelSize) => onResize(panelSize.asPercentage)}
        >
          {children}
        </ResizablePanel>
      </>
    );
  },
);
