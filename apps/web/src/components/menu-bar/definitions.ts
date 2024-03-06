import { executeCommand } from "@/commands";
import { MenuItem } from "@/utils/menuItem";

export const menuBarDefinition: MenuItem[] = [
  {
    type: "parent",
    label: "File",
    items: [
      {
        type: "parent",
        label: "Save As...",
        items: [
          {
            type: "leaf",
            label: "JPEG Picture",
            action: {
              onClick: () =>
                executeCommand("saveCurrentWorkspaceAsFile", {
                  workspaceId: "1",
                  layerName: "1",
                  format: "jpeg",
                }),
            },
          },
          {
            type: "leaf",
            label: "PNG Picture",
            action: {
              onClick: () =>
                executeCommand("saveCurrentWorkspaceAsFile", {
                  workspaceId: "1",
                  layerName: "1",
                  format: "png",
                }),
            },
          },
        ],
      },
      {
        type: "separator",
      },
      {
        type: "parent",
        label: "Temp don't use",
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

