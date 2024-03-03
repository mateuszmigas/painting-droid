import { KeyGesture } from "@/utils/keyGesture";

type MenuItemAction =
  | {
      onClick: () => void;
    }
  | {
      commandId: string;
    }
  | {
      role: string;
    };

export type MenuItem =
  | {
      type: "parent";
      label: string;
      items: MenuItem[];
    }
  | {
      type: "child";
      action: MenuItemAction;
      label: string;
      disabled?: boolean;
      KeyGesture?: KeyGesture;
    }
  | {
      type: "separator";
    };

