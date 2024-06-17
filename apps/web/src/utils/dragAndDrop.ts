import type { DragEvent } from "react";

export const createDragWatcherProps = (
  setIsDragging: (isDragging: boolean) => void
) => {
  return {
    onDragOver: (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (
        e.relatedTarget === null ||
        !e.currentTarget.contains(e.relatedTarget as never)
      ) {
        setIsDragging(false);
      }
    },
    onDrop: (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    },
  };
};

