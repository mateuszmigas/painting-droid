import { IconButton } from "../icons/iconButton";
import { useToolStore } from "@/store";
import { memo } from "react";
import { type ToolId, defaultToolsSettings, toolsMetadata } from "@/tools";
import type { IconType } from "../icons/icon";
import { useCommandService } from "@/contexts/commandService";
import { useDialogService } from "@/contexts/dialogService";
import { useCanvasActionDispatcher } from "@/hooks";
import { GenerateImageDialog } from "../dialogs/generateImageDialog";

const tools: { id: ToolId; icon: IconType; name: string }[] = (
  Object.keys(defaultToolsSettings) as ToolId[]
).map((id) => {
  const metadata = toolsMetadata[id];
  return {
    id,
    icon: metadata.icon,
    name: metadata.name,
  };
});

export const SelectToolPanel = memo(() => {
  const { selectedToolId } = useToolStore((state) => state);
  const { executeCommand } = useCommandService();
  const { openDialog } = useDialogService();
  const canvasDispatcher = useCanvasActionDispatcher();

  const generateImage = async () => {
    const result = await openDialog(GenerateImageDialog, {});
    if (result) {
      const box = {
        x: 0,
        y: 0,
        width: result.data!.width / 2,
        height: result.data!.height / 2,
      };
      executeCommand("selectTool", { toolId: "rectangleSelect" });
      canvasDispatcher.execute("drawOverlayShape", {
        overlayShape: {
          type: "rectangle",
          boundingBox: box,
          captured: {
            box: { x: 0, y: 0, width: 0, height: 0 },
            data: result.data!,
          },
        },
      });
    }
  };
  return (
    <div className="flex flex-col gap-medium">
      <div className="flex flex-wrap flex-row gap-small p-small">
        {tools.map(({ id, icon, name }) => (
          <IconButton
            aria-label={name}
            title={name}
            className={
              selectedToolId === id
                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                : ""
            }
            key={id}
            type={icon}
            size="medium"
            onClick={() => executeCommand("selectTool", { toolId: id })}
          />
        ))}
        <IconButton
          title={"Cat generator"}
          type={"brain"}
          size="medium"
          onClick={generateImage}
        />
      </div>
    </div>
  );
});
