import { PanelHeader } from "./panelHeader";
import { translations } from "@/translations";
import { IconButton } from "../iconButton";
import { useDrawingToolStore } from "@/store";
import { DrawingToolType } from "@/drawing-tools";

const tools: DrawingToolType[] = ["pen", "pencil"];

export const SelectToolPanel = () => {
  const { selectedTool, setSelectedTool } = useDrawingToolStore(
    (state) => state
  );
  return (
    <div className="flex flex-col gap-medium">
      <PanelHeader title={translations.tools} />
      <div className="flex flex-wrap flex-row gap-small p-small">
        {tools.map((tool) => (
          <IconButton
            className={selectedTool === tool ? "bg-accent" : ""}
            key={tool}
            type={tool}
            size="medium"
            onClick={() => setSelectedTool(tool)}
          />
        ))}
      </div>
    </div>
  );
};

