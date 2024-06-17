import { cn } from "@/utils/css";
import { useState } from "react";
import { Icon, type IconType } from "./icons/icon";
import { splitNameAndExtension } from "@/utils/path";
import type { FileInfo } from "@/utils/file";

const getFilesFromEvent = (event: React.DragEvent<HTMLDivElement>) => {
  if (event.dataTransfer.items) {
    return [...event.dataTransfer.items]
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()!);
  }
  return [...event.dataTransfer.files];
};

export const DropFileZone = (props: {
  icon: IconType;
  display: string;
  onDrop: (files: FileInfo[]) => void;
  supportedExtensions: string[];
  className?: string;
}) => {
  const [isDragOver, setDragOver] = useState(false);
  const { icon, display, onDrop, className } = props;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnter={(e) => {
        e.stopPropagation();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        const files = getFilesFromEvent(e);
        const namesWithExtensions = files.map((file) => ({
          blob: file,
          ...splitNameAndExtension(file.name),
        }));

        const { supportedExtensions } = props;
        const supportedFiles = namesWithExtensions.filter(({ extension }) => {
          if (!extension) return false;
          return supportedExtensions.some((ext) => extension.endsWith(ext));
        });

        supportedFiles.length > 0 && onDrop(supportedFiles);
      }}
      className={cn(
        "bg-popover/90 gap-medium flex-col font-bold text-popover-foreground transition-colors duration-300 rounded-md border-2 border-muted flex-1 border-dashed flex justify-center items-center",
        { "bg-accent/90 text-accent-foreground border-primary": isDragOver },
        className
      )}
    >
      <Icon size={48} type={icon} />
      {display}
    </div>
  );
};

