import { memo } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { useWorkspacesStore } from "@/store";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import { AdjustmentsPopup } from "./adjustmentsPopup";

export const WorkspacePopup = memo(() => {
  const popup = useWorkspacesStore(
    (store) => activeWorkspaceSelector(store).popup
  );
  const closePopup = useWorkspacesStore((store) => store.closeApplyPopup);
  return (
    <Popover
      open={popup !== null}
      onOpenChange={(open) => !open && closePopup()}
    >
      <PopoverTrigger />
      <PopoverContent className="absolute left-5 w-auto">
        {popup?.type === "adjustments" && <AdjustmentsPopup />}
      </PopoverContent>
    </Popover>
  );
});

