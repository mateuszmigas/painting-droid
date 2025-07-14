import { memo } from "react";
import { useWorkspacesStore } from "@/store";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AdjustmentsPopup } from "./adjustmentsPopup";
import { ChatPopup } from "./chatPopup";

const translations = getTranslations();

export const WorkspacePopup = memo(() => {
  const popup = useWorkspacesStore((store) => activeWorkspaceSelector(store).popup);
  const closePopup = useWorkspacesStore((store) => store.closePopup);
  return (
    <Popover open={popup !== null} onOpenChange={(open) => !open && closePopup()}>
      <PopoverTrigger title={translations.adjustments.name} />
      <PopoverContent className="absolute left-6 top-1 w-auto">
        {popup?.type === "adjustments" && <AdjustmentsPopup />}
        {popup?.type === "chat" && <ChatPopup />}
      </PopoverContent>
    </Popover>
  );
});
