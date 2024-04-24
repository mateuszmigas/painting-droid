export type MenuItemAction =
  | { onClick: () => void }
  | { commandId: string }
  | { role: string };

export const handleMenuItemAction = (action: MenuItemAction) => {
  if ("onClick" in action) {
    action.onClick();
  } else {
    throw new Error("Not implemented");
  }
};

