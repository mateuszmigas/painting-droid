import { translations } from "@/translations";
import { PanelHeader } from "./panelHeader";

export const MetadataPanel = () => {
  return (
    <div className="flex flex-col gap-medium">
      <PanelHeader title={translations.metadata} />
      <div className="flex flex-wrap flex-row gap-small p-small"></div>
    </div>
  );
};

