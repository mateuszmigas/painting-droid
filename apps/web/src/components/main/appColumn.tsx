import { memo, useEffect } from "react";
import { usePanelRef } from "react-resizable-panels";
import { ResizablePanel } from "@/components/ui/resizable";

export const AppColumn = memo(
  (props: { size: number; onResize: (size: number) => void; children: React.ReactNode }) => {
    const { size, onResize, children } = props;
    const panelRef = usePanelRef();

    useEffect(() => {
      panelRef.current?.resize(`${size}%`);
    }, [size, panelRef]);

    return (
      <ResizablePanel
        panelRef={panelRef}
        defaultSize={`${size}%`}
        onResize={(panelSize) => onResize(panelSize.asPercentage)}
      >
        {children}
      </ResizablePanel>
    );
  },
);
