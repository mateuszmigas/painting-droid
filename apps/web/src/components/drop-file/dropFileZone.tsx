import { useState } from "react";
import { cn } from "@/utils/css";
import type { FileInfo } from "@/utils/file";
import { splitNameAndExtension } from "@/utils/path";
import { Icon, type IconType } from "../icons/icon";

const getFilesFromEvent = (event: React.DragEvent<HTMLDivElement>) => {
  if (event.dataTransfer.items) {
    return [...event.dataTransfer.items].filter((item) => item.kind === "file").map((item) => item.getAsFile()!);
  }
  return [...event.dataTransfer.files];
};

export const DropFileZone = (props: {
  icon: IconType;
  display: string;
  onDrop: (files: FileInfo[]) => void;
  className?: string;
}) => {
  const [isDragOver, setDragOver] = useState(false);
  const { icon, display, onDrop, className } = props;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: checked
    <div
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnter={() => setDragOver(true)}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        const files = getFilesFromEvent(e);
        const fileInfos = files.map((file) => ({
          blob: file,
          ...splitNameAndExtension(file.name),
        }));

        fileInfos.length > 0 && onDrop(fileInfos);
      }}
      className={cn(
        "gap-medium flex-col font-bold text-popover-foreground transition-colors duration-300 rounded-md border-2 border-muted flex-1 border-dashed flex justify-center items-center",
        { "bg-accent/90 text-accent-foreground border-primary": isDragOver },
        className,
      )}
    >
      <Icon size={48} type={icon} />
      {display}
    </div>
  );
};
