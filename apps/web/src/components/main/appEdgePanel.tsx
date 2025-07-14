import { memo, useEffect, useRef } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { ResizablePanel } from "@/components/ui/resizable";
import { PanelHeader } from "../panels/panelHeader";

export const AppEdgePanel = memo(
  (props: { title: string; size: number; onResize: (size: number) => void; children: React.ReactNode }) => {
    const { title, size, onResize, children } = props;
    const ref = useRef<ImperativePanelHandle>(null);

    useEffect(() => {
      ref.current?.resize(size);
    }, [size]);

    return (
      <>
        <PanelHeader title={title} />
        <ResizablePanel ref={ref} defaultSize={size} onResize={onResize}>
          {children}
        </ResizablePanel>
      </>
    );
  },
);
