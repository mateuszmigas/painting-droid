export type MenuItemAction =
  | { onClick: () => void }
  | { commandId: string }
  | { role: string };

