import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { createMenuBarDefinition } from "./definitions";
import type { MenuItem } from "@/utils/menuItem";
import { Fragment } from "react/jsx-runtime";
import type { MenuItemAction } from "@/utils/menuItemAction";
import { useCommandService } from "@/contexts/commandService";
import { memo } from "react";
import { useWorkspacesStore } from "@/store";

const processAction = (action: MenuItemAction) => {
  if ("onClick" in action) {
    action.onClick();
  } else {
    throw new Error("Not implemented");
  }
};

const mapMenuItemToMenubar = (item: MenuItem) => {
  switch (item.type) {
    case "parent":
      return (
        <MenubarSub>
          <MenubarSubTrigger>{item.label}</MenubarSubTrigger>
          <MenubarSubContent>
            {item.items.map((subItem, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: intentional
              <Fragment key={index}>{mapMenuItemToMenubar(subItem)}</Fragment>
            ))}
          </MenubarSubContent>
        </MenubarSub>
      );
    case "leaf":
      return (
        <MenubarItem
          disabled={item.disabled}
          onClick={() => processAction(item.action)}
        >
          {item.label}
          {item.KeyGesture ? (
            <MenubarShortcut>{item.KeyGesture.toString()}</MenubarShortcut>
          ) : null}
        </MenubarItem>
      );
    case "separator":
      return <MenubarSeparator />;
    default:
      throw new Error("Invalid menu item type");
  }
};

export const MenuBar = memo(() => {
  const { executeCommand } = useCommandService();
  const { workspaces } = useWorkspacesStore();
  const menuBarDefinition = createMenuBarDefinition(
    { workspaces },
    executeCommand
  );
  return (
    <Menubar className="border-none shadow-none">
      {menuBarDefinition.map((parent, index) => {
        if (parent.type !== "parent") {
          throw new Error("Invalid menu bar definition");
        }

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: intentional
          <MenubarMenu key={index}>
            <MenubarTrigger>{parent.label}</MenubarTrigger>
            <MenubarContent>
              {parent.items.map((item, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: intentional
                <Fragment key={index}>{mapMenuItemToMenubar(item)}</Fragment>
              ))}
            </MenubarContent>
          </MenubarMenu>
        );
      })}
    </Menubar>
  );
});
