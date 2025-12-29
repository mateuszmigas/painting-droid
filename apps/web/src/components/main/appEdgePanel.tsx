import { memo, useEffect } from "react";
import { usePanelRef } from "react-resizable-panels";
import { ResizablePanel } from "@/components/ui/resizable";
import { PanelHeader } from "../panels/panelHeader";

export const AppEdgePanel = memo(
  (props: { title: string; size: number; onResize: (size: number) => void; children: React.ReactNode }) => {
    const { title, size, onResize, children } = props;
    const panelRef = usePanelRef();

    useEffect(() => {
      panelRef.current?.resize(`${size}%`);
    }, [size, panelRef]);

    return (
      <>
        <PanelHeader title={title} />
        <ResizablePanel
          panelRef={panelRef}
          defaultSize={`${size}%`}
          onResize={(panelSize) => onResize(panelSize.asPercentage)}
        >
          {children}
        </ResizablePanel>
      </>
    );
  },
);
