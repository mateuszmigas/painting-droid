import { memo } from "react";
import { DropFileZone } from "./dropFileZone";
import { supportedDropFileExtensions } from "@/constants";
import { useCommandService } from "@/contexts/commandService";
import { getTranslations } from "@/translations";
import { cn } from "@/utils/css";
const translations = getTranslations().commands.dropFiles;

export const DropFileContainer = memo((props: { className?: string }) => {
  const { className } = props;
  const { executeCommand } = useCommandService();
  return (
    <div
      className={cn(
        "bg-popover/90 p-small size-full flex flex-col gap-small",
        className
      )}
    >
      <DropFileZone
        icon="add-file"
        display={translations.createNewWorkspace}
        supportedExtensions={supportedDropFileExtensions}
        onDrop={(files) =>
          executeCommand("dropFiles", {
            files,
            operation: "create-new-workspace",
          })
        }
      />
      <DropFileZone
        icon="plus"
        display={translations.addNewLayer}
        supportedExtensions={supportedDropFileExtensions}
        onDrop={(files) =>
          executeCommand("dropFiles", {
            files,
            operation: "add-new-layer",
          })
        }
      />
      <DropFileZone
        icon="clipboard-paste"
        display={translations.pasteOntoActiveLayer}
        supportedExtensions={supportedDropFileExtensions}
        onDrop={(files) =>
          executeCommand("dropFiles", {
            files,
            operation: "paste-onto-active-layer",
          })
        }
      />
    </div>
  );
});
