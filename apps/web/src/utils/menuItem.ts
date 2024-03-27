import type { KeyGesture } from "@/utils/keyGesture";
import type { MenuItemAction } from "./menuItemAction";
import type { IconType } from "@/components/icons/icon";

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
      keyGesture?: KeyGesture;
      icon?: IconType;
    }
  | {
      type: "separator";
    };

