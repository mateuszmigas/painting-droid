import { PanelHeader } from "./panelHeader";
import { Icon } from "../icon";
import { translations } from "@/translations";

export const SelectToolPanel = () => {
  return (
    <div>
      <PanelHeader title={translations.tools} />
      <div>
        <Icon type="pen" size="medium" />
        {/* <button>Pointer</button>
        <button>Marquee</button>
        <button>Lasso</button> */}
      </div>
    </div>
  );
};

