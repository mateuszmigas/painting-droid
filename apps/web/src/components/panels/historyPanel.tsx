import { canvasActionDispatcher } from "@/canvas/canvasActionDispatcher";
import { IconButton } from "../iconButton";

export const HistoryPanel = () => {
  // const { history } = useWorkspacesStore(activeWorkspaceCanvasDataSelector);

  return (
    <div className="flex flex-col size-full p-small gap-small">
      <div className="flex flex-row gap-small items-center">
        <IconButton
          type="plus"
          size="small"
          onClick={() => {
            canvasActionDispatcher.undo();
          }}
        />
        <IconButton
          type="copy"
          size="small"
          onClick={() => {
            canvasActionDispatcher.redo();
          }}
        />
      </div>
      <div className="flex-1 overflow-auto flex flex-col" />
    </div>
  );
};
