import { ResizablePanel } from "@/components/ui/resizable";
import { memo, useEffect, useRef } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

export const AppColumn = memo(
  (props: {
    size: number;
    onResize: (size: number) => void;
    children: React.ReactNode;
  }) => {
    const { size, onResize, children } = props;
    const ref = useRef<ImperativePanelHandle>(null);

    useEffect(() => {
      ref.current?.resize(size);
    }, [size]);

    return (
      <ResizablePanel ref={ref} defaultSize={size} onResize={onResize}>
        {children}
      </ResizablePanel>
    );
  }
);

