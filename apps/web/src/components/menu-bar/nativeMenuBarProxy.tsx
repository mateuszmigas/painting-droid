import {
  Menu as NativeMenu,
  MenuItem as NativeMenuItem,
  PredefinedMenuItem as NativePredefinedMenuItem,
  Submenu as NativeSubmenu,
} from "@tauri-apps/api/menu";
import { memo, useEffect } from "react";
import { useCommandService } from "@/contexts/commandService";
import { useWorkspacesStore } from "@/store";
import { keyGestureToAccelerator } from "@/utils/keyGesture";
import type { MenuItem } from "@/utils/menuItem";
import { handleMenuItemAction } from "@/utils/menuItemAction";
import { createMenuBarDefinition } from "./menuBarDefinition";

const mapMenuItemToNative = async (item: MenuItem) => {
  switch (item.type) {
    case "parent": {
      const parent = await NativeSubmenu.new({ text: item.label });
      for (const subItem of item.items) {
        const menuItem = await mapMenuItemToNative(subItem);
        parent.append(menuItem);
      }
      return parent;
    }
    case "leaf": {
      return NativeMenuItem.new({
        text: item.label,
        accelerator: item.keyGesture ? keyGestureToAccelerator(item.keyGesture) : undefined,
        enabled: !item.disabled,
        action: () => handleMenuItemAction(item.action),
      });
    }
    case "separator":
      return NativePredefinedMenuItem.new({ item: "Separator" });
    default:
      throw new Error("Invalid menu item type");
  }
};
export const NativeMenuBarProxy = memo(() => {
  const { executeCommand } = useCommandService();
  const workspaces = useWorkspacesStore();
  const menuItems = createMenuBarDefinition({ workspaces }, executeCommand);

  useEffect(() => {
    const createMenuBar = async () => {
      const defaultMenu = await NativeMenu.default();
      const systemSubmenu = (await defaultMenu.items())[0];
      const appMenu = await NativeMenu.new();
      appMenu.append(systemSubmenu);

      for (const item of menuItems) {
        const menuItem = await mapMenuItemToNative(item);
        appMenu.append(menuItem);
      }

      appMenu.setAsAppMenu();
    };
    createMenuBar();
  }, [menuItems]);

  return null;
});
