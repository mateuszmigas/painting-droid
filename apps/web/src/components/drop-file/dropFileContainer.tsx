import { memo } from "react";
import { DropFileZone } from "./dropFileZone";
import { supportedDropFileExtensions } from "@/constants";
import { useCommandService } from "@/contexts/commandService";
import { getTranslations } from "@/translations";
import { cn } from "@/utils/css";
import type { FileInfo } from "@/utils/file";
import { useNotificationService } from "@/contexts/notificationService";
const translations = getTranslations();

export const DropFileContainer = memo((props: { className?: string }) => {
  const { className } = props;
  const { executeCommand } = useCommandService();
  const { showError } = useNotificationService();
  const dropFiles = async (
    files: FileInfo[],
    operation:
      | "create-new-workspace"
      | "add-new-layer"
      | "paste-onto-active-layer"
  ) => {
    const supportedFiles = files.filter(({ extension }) => {
      if (!extension) return false;
      return supportedDropFileExtensions.some((ext) => extension.endsWith(ext));
    });

    if (supportedFiles.length === 0) {
      showError(translations.errors.noFilesDropped);
      return;
    }

    executeCommand("dropFile", {
      file: supportedFiles[0],
      operation,
    });
  };
  return (
    <div
      className={cn(
        "bg-popover/90 p-small size-full flex flex-col gap-small",
        className
      )}
    >
      <DropFileZone
        icon="add-file"
        display={translations.commands.dropFiles.createNewWorkspace}
        onDrop={(files) => dropFiles(files, "create-new-workspace")}
      />
      <DropFileZone
        icon="plus"
        display={translations.commands.dropFiles.addNewLayer}
        onDrop={(files) => dropFiles(files, "add-new-layer")}
      />
      {/* <DropFileZone
        icon="clipboard-paste"
        display={translations.commands.dropFiles.pasteOntoActiveLayer}
        onDrop={(files) => dropFiles(files, "paste-onto-active-layer")}
      /> */}
    </div>
  );
});
