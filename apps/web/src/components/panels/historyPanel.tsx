import { useWorkspacesStore } from "@/store";
import {
  type LayerChange,
  activeWorkspaceCanvasDataSelector,
} from "@/store/workspacesStore";
import { assertNever } from "@/utils/typeGuards";

const renderLayerChange = (item: LayerChange) => {
  const { type } = item;
  switch (type) {
    case "add": {
      return "New layer added";
    }
    case "draw": {
      return "Drawing on layer";
    }
    case "remove": {
      return "Layer removed";
    }
    case "duplicate": {
      return "Layer duplicated";
    }
    default:
      assertNever(type);
  }
};
export const HistoryPanel = () => {
  const { history } = useWorkspacesStore(activeWorkspaceCanvasDataSelector);

  return (
    <div className="flex flex-col size-full p-small gap-small">
      {/* <div className="flex flex-row gap-small items-center">
        <IconButton type="plus" size="small" onClick={() => {}} />
        <IconButton type="copy" size="small" onClick={() => {}} />
      </div> */}
      <div className="flex-1 overflow-auto flex flex-col">
        {history.map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={index} className="flex flex-row gap-small items-center">
            {renderLayerChange(item)}
          </div>
        ))}
      </div>
    </div>
  );
};
