import { type AdjustmentId, adjustmentsMetadata } from "@/adjustments";
import type { ExecuteCommand } from "@/commands";
import type { Workspace } from "@/store/workspacesStore";
import type { MenuItem } from "@/utils/menuItem";

export const createMenuBarDefinition = (
  stores: {
    workspaces: Workspace[];
  },
  executeCommand: ExecuteCommand
): MenuItem[] => {
  const workspaces = stores.workspaces;
  return [
    {
      type: "parent",
      label: "File",
      items: [
        {
          type: "leaf",
          label: "New",
          action: { onClick: () => executeCommand("createActiveWorkspace") },
        },
        {
          type: "leaf",
          label: "Open",
          action: { onClick: () => executeCommand("openWorkspace") },
        },
        {
          type: "leaf",
          disabled: workspaces.length === 1,
          label: "Close",
          action: { onClick: () => executeCommand("closeActiveWorkspace") },
        },
        {
          type: "separator",
        },
        {
          type: "parent",
          label: "Save As...",
          items: [
            {
              type: "leaf",
              label: "PDW Workspace",
              action: { onClick: () => executeCommand("saveAsWorkspace") },
            },
            {
              type: "leaf",
              label: "JPEG Picture",
              action: { onClick: () => executeCommand("saveAsJpeg") },
            },
            {
              type: "leaf",
              label: "PNG Picture",
              action: { onClick: () => executeCommand("saveAsPng") },
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
          label: "Undo",
          action: { onClick: () => executeCommand("undoCanvasAction") },
        },
        {
          type: "leaf",
          label: "Redo",
          action: { onClick: () => executeCommand("redoCanvasAction") },
        },
      ],
    },
    {
      type: "parent",
      label: "Adjustments",
      items: Object.entries(adjustmentsMetadata).map(([id, metadata]) => ({
        type: "leaf",
        label: metadata.name,
        action: {
          onClick: () =>
            executeCommand("openAdjustmentsPopup", {
              adjustmentId: id as AdjustmentId,
            }),
        },
      })),
    },
  ];
};
