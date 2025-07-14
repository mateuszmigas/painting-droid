import { memo, useState } from "react";
import { useCanvasActionDispatcher, useListener } from "@/hooks";
import { CommandIconButton } from "../commandIconButton";
import { Icon, type IconType } from "../icons/icon";

export const HistoryPanel = memo(() => {
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const [actions, setActions] = useState<{ display: string; icon: IconType }[]>([]);
  const [cursor, setCursor] = useState(0);

  useListener(
    canvasActionDispatcher.observableStackInfo,
    (info) => {
      setActions(info.actions);
      setCursor(info.cursor);
    },
    { triggerOnMount: true },
  );

  return (
    <div className="flex flex-col size-full p-small gap-small">
      <div className="flex flex-row gap-small items-center">
        <CommandIconButton disabled={cursor === 0} commandId="undoCanvasAction" />
        <CommandIconButton disabled={cursor === actions.length - 1} commandId="redoCanvasAction" />
      </div>
      <div className="flex-1 overflow-auto flex flex-col">
        {actions.map((action, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: The index is the key
            key={index}
            className={`rounded-sm border-2 flex flex-row gap-small items-center ${
              index === cursor ? "border-primary" : " border-transparent"
            } p-small`}
          >
            <Icon type={action.icon} size="small" />
            <div className="truncate">{action.display}</div>
          </div>
        ))}
      </div>
    </div>
  );
});
