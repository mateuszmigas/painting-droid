import { PanelHeader } from "./panelHeader";
import { translations } from "@/translations";
import { IconButton } from "../iconButton";
import { useDrawingToolStore } from "@/store";
import { memo } from "react";
import { type ToolId, defaultToolsSettings, toolsMetadata } from "@/tools";

const tools: { id: ToolId; name: string }[] = (Object.keys(defaultToolsSettings) as ToolId[]).map((id) => ({
  id,
  name: toolsMetadata[id].name,
}));

export const SelectToolPanel = memo(() => {
  const { selectedToolId, setSelectedToolId } = useDrawingToolStore((state) => state);
  return (
    <div className="flex flex-col gap-medium">
      <PanelHeader title={translations.tools} />
      <div className="flex flex-wrap flex-row gap-small p-small">
        {tools.map(({ id, name }) => (
          <IconButton
            aria-label={name}
            title={name}
            className={
              selectedToolId === id
                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                : ""
            }
            key={id}
            type={id}
            size="medium"
            onClick={() => setSelectedToolId(id)}
          />
        ))}
      </div>
    </div>
  );
});
