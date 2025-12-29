import { memo } from "react";
import { ResizablePanel } from "@/components/ui/resizable";

export const AppColumn = memo(
  (props: { size: number; onResize: (size: number) => void; children: React.ReactNode }) => {
    const { size, onResize, children } = props;

    return (
      <ResizablePanel
        defaultSize={`${size}%`}
        onResize={(panelSize) => onResize(panelSize.asPercentage)}
      >
        {children}
      </ResizablePanel>
    );
  },
);
