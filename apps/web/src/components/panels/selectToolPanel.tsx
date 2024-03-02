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
    <div className="p-2 flex flex-col gap-2">
      <PanelHeader title={translations.tools} />
      <div className="flex flex-wrap flex-row gap-1">
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

