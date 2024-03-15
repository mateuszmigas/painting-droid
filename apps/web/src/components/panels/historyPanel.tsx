import { canvasActionDispatcher } from "@/canvas/canvasActionDispatcher";
import { IconButton } from "../iconButton";
import { useEffect, useState } from "react";
import type { IconType } from "../icon";

export const HistoryPanel = () => {
  const [actions, setActions] = useState<{ display: string; icon: IconType }[]>(
    []
  );
  // const acti;
  const [cursor, setCursor] = useState(0);
  useEffect(() => {
    const unsubscribe = canvasActionDispatcher.subscribeToActionsChange(
      (info) => {
        setActions(info.actions);
        setCursor(info.cursor);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col size-full p-small gap-small">
      <div className="flex flex-row gap-small items-center">
        <IconButton
          type="plus"
          size="small"
          onClick={() => canvasActionDispatcher.undo()}
        />
        <IconButton
          type="copy"
          size="small"
          onClick={() => canvasActionDispatcher.redo()}
        />
      </div>
      <div className="flex-1 overflow-auto flex flex-col">
        {actions.map((action, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            className={`flex flex-row gap-small items-center ${
              index === cursor ? "bg-gray-200" : ""
            } p-small`}
          >
            <div>{action.display}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
