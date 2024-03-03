import { MenuItem } from "@/utils/menuItem";

export const menuBarDefinition: MenuItem[] = [
  {
    type: "parent",
    label: "File",
    items: [
      {
        type: "leaf",
        label: "New Tab",
        action: { onClick: () => console.log("New Tab") },
      },
      {
        type: "separator",
      },
      {
        type: "parent",
        label: "Recent",
        items: [
          {
            type: "leaf",
            label: "File 1",
            action: { onClick: () => console.log("File 1") },
          },
          {
            type: "leaf",
            label: "File 2",
            action: { onClick: () => console.log("File 2") },
          },
          {
            type: "parent",
            label: "More...",
            items: [
              {
                type: "leaf",
                label: "File 3",
                action: { onClick: () => console.log("File 3") },
              },
              {
                type: "leaf",
                label: "File 4",
                action: { onClick: () => console.log("File 4") },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "parent",
    label: "Edit",
    items: [
      {
        type: "leaf",
        label: "File 2",
        action: { onClick: () => console.log("File 2") },
      },
    ],
  },
];

