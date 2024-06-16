import { useDragAndDropFilesContext } from "@/contexts/dragAndDropFilesContext";
import { cn } from "@/utils/css";
import { useState } from "react";

export const DropFileZone = (props: {
  display: string;
  onDrop: (files: string) => void;
  className?: string;
}) => {
  const { setIsDragging } = useDragAndDropFilesContext();
  const [isDragOver, setDragOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnter={(e) => {
        e.stopPropagation();
        setDragOver(true);
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setDragOver(false);
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
      }}
      className={cn(
        "bg-popover/90 font-bold text-popover-foreground transition-colors duration-300 rounded-md border-2 border-muted flex-1 flex justify-center items-center",
        { "bg-accent/90 text-accent-foreground border-primary": isDragOver },
        props.className
      )}
    >
      {props.display}
    </div>
  );
};

