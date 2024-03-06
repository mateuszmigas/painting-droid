import { PanelHeader } from "./panelHeader";
import { translations } from "@/translations";
import { IconButton } from "../iconButton";
import { useDrawingToolStore } from "@/store";
import { memo } from "react";
import { ToolId, defaultToolsSettings } from "@/tools";

const tools: ToolId[] = Object.keys(defaultToolsSettings) as ToolId[];

export const SelectToolPanel = memo(() => {
  const { selectedToolId, setSelectedToolId } = useDrawingToolStore(
    (state) => state
  );
  return (
    <div className="flex flex-col gap-medium">
      <PanelHeader title={translations.tools} />
      <div className="flex flex-wrap flex-row gap-small p-small">
        {tools.map((tool) => (
          <IconButton
            className={selectedToolId === tool ? "bg-accent" : ""}
            key={tool}
            type={tool}
            size="medium"
            onClick={() => setSelectedToolId(tool)}
          />
        ))}
      </div>
    </div>
  );
});

