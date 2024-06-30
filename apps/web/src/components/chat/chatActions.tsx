import { memo } from "react";
import { IconButton } from "../icons/iconButton";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import type { ChatActionKey } from "@/models/types/chatModel";
import { type AdjustmentId, adjustmentsMetadata } from "@/adjustments";

export const ChatActions = memo(
  (props: {
    actions: ChatActionKey[];
    onCopy: () => void;
    onRetry: () => void;
  }) => {
    const { actions, onCopy, onRetry } = props;

    return (
      <div className="flex flex-row items-center text-muted-foreground w-full h-9">
        <IconButton onClick={onCopy} type="copy" size="small" />
        <IconButton onClick={onRetry} type="refresh" size="small" />
        <ScrollArea>
          <div className="flex flex-row items-center ml-2">
            {actions.map((action) => (
              <Button
                key={action}
                variant="link"
                className="p-2"
                onClick={() => {
                  console.log("handling action", action);
                }}
              >
                {adjustmentsMetadata[action as AdjustmentId].name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }
);

