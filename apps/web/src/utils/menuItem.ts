import { KeyGesture } from "@/utils/keyGesture";
import { MenuItemAction } from "./menuItemAction";

export type MenuItem =
  | {
      type: "parent";
      label: string;
      items: MenuItem[];
    }
  | {
      type: "leaf";
      action: MenuItemAction;
      label: string;
      disabled?: boolean;
      KeyGesture?: KeyGesture;
    }
  | {
      type: "separator";
    };
