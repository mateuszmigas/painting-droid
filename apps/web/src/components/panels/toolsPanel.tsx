import { memo } from "react";
import { useCommandService } from "@/contexts/commandService";
import { useToolStore } from "@/store";
import { type CanvasToolId, canvasToolsMetadata, defaultCanvasToolsSettings } from "@/tools";
import { testIds } from "@/utils/testIds";
import { CommandIconButton } from "../commandIconButton";
import type { IconType } from "../icons/icon";
import { IconButton } from "../icons/iconButton";
import { Separator } from "../ui/separator";

const tools: { id: CanvasToolId; icon: IconType; name: string }[] = (
  Object.keys(defaultCanvasToolsSettings) as CanvasToolId[]
).map((id) => {
  const metadata = canvasToolsMetadata[id];
  return {
    id,
    icon: metadata.icon,
    name: metadata.name,
  };
});

export const ToolsPanel = memo(() => {
  const { selectedToolId } = useToolStore((state) => state);
  const { executeCommand } = useCommandService();

  return (
    <div className="flex flex-col gap-medium">
      <div className="flex flex-wrap flex-row gap-small p-small">
        {tools.map(({ id, icon, name }) => (
          <IconButton
            data-testid={testIds.toolButton(id)}
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
        <Separator orientation="horizontal" className="my-1" />
        <CommandIconButton size="medium" commandId="openTextToImageDialog" />
        <CommandIconButton size="medium" commandId="openImageToImageDialog" />
        <CommandIconButton size="medium" commandId="openLabelObjectsDialog" />
        <CommandIconButton size="medium" commandId="openRemoveBackgroundDialog" />
        <CommandIconButton size="medium" commandId="openChatPopup" />
      </div>
    </div>
  );
});
