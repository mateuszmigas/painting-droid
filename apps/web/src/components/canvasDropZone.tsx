import { memo } from "react";
import { DropFileZone } from "./dropFileZone";
import { supportedDropFileExtensions } from "@/constants";
import { useCommandService } from "@/contexts/commandService";
import { getTranslations } from "@/translations";
const translations = getTranslations().commands.dropFiles;

export const CanvasDropZone = memo(() => {
  const { executeCommand } = useCommandService();
  return (
    <>
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
        display={translations.createNewWorkspace}
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
    </>
  );
});

