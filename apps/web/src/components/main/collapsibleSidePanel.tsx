import { ResizablePanel } from "@/components/ui/resizable";
import { memo } from "react";
import { PanelHeader } from "../panels/panelHeader";

export const CollapsibleSidePanel = memo(
  (props: {
    title: string;
    size: number;
    onResize: (size: number) => void;
    children: React.ReactNode;
  }) => {
    const { title, size, onResize, children } = props;

    return (
      <>
        <PanelHeader title={title} />
        <ResizablePanel defaultSize={size} onResize={onResize}>
          {children}
        </ResizablePanel>
      </>
    );
  }
);

