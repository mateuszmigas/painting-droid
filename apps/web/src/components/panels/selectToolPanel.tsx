import { IconButton } from "../icons/iconButton";
import { useToolStore } from "@/store";
import { memo } from "react";
import { type ToolId, defaultToolsSettings, toolsMetadata } from "@/tools";
import type { IconType } from "../icons/icon";
import { useCommandService } from "@/contexts/commandService";
import { CommandIconButton } from "../commandIconButton";

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
        <CommandIconButton size="medium" commandId="openTextToImageDialog" />
      </div>
    </div>
  );
});
