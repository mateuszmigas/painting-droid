import { type DragEvent, type DragEventHandler, useState } from "react";

export const useDragWatcher = (): [boolean, Record<string, DragEventHandler>] => {
  const [isDragging, setIsDragging] = useState(false);
  return [
    isDragging,
    {
      onDragOver: (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
      },
      onDragLeave: (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.relatedTarget === null || !e.currentTarget.contains(e.relatedTarget as never)) {
          setIsDragging(false);
        }
      },
      onDrop: (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
      },
    },
  ];
};
