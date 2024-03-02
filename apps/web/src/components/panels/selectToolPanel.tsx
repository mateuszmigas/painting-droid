import { PanelHeader } from "./panelHeader";
import { Icon } from "../icon";

export const SelectToolPanel = () => {
  return (
    <div>
      <PanelHeader title="Select Tool" />
      <div>
        <Icon type="pen" size="medium" />
        {/* <button>Pointer</button>
        <button>Marquee</button>
        <button>Lasso</button> */}
      </div>
    </div>
  );
};

