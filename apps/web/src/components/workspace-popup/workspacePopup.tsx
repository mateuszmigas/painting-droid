import { memo } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { useWorkspacesStore } from "@/store";
import { activeWorkspaceSelector } from "@/store/workspacesStore";

export const WorkspacePopup = memo(() => {
  const isOpen = useWorkspacesStore(
    (store) => activeWorkspaceSelector(store).popup !== null
  );

  return (
    <Popover open={isOpen}>
      <PopoverTrigger />
      <PopoverContent className="absolute left-5">
        Place content for the popover here.
      </PopoverContent>
    </Popover>
  );
});

