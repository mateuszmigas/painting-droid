import { type AdjustmentId, adjustmentsMetadata } from "@/adjustments";
import { commands, type CommandId, type ExecuteCommand } from "@/commands";
import {
  activeWorkspaceCanvasDataSelector,
  type useWorkspacesStore,
} from "@/store/workspacesStore";
import type { MenuItem } from "@/utils/menuItem";
import { getTranslations } from "@/translations";

const translations = getTranslations();

const itemFromCommand = (
  commandId: CommandId,
  executeCommand: ExecuteCommand,
  disabled?: boolean,
  name?: string
): MenuItem => {
  const command = commands[commandId];
  return {
    id: commandId,
    type: "leaf",
    icon: command.icon,
    label: name ?? command.display ?? translations.general.unknown,
    keyGesture: command.defaultKeyGesture,
    disabled,
    action: { onClick: () => executeCommand(commandId as never) },
  };
};

export const createMenuBarDefinition = (
  stores: {
    workspaces: ReturnType<typeof useWorkspacesStore.getState>;
  },
  executeCommand: ExecuteCommand
): MenuItem[] => {
  const { layers, activeLayerIndex } = activeWorkspaceCanvasDataSelector(
    stores.workspaces
  );
  return [
    {
      type: "parent",
      label: "File",
      items: [
        itemFromCommand("openFile", executeCommand),
        itemFromCommand("createActiveWorkspace", executeCommand),
        itemFromCommand("editWorkspace", executeCommand),
        itemFromCommand("closeActiveWorkspace", executeCommand),
        { type: "separator" },
        {
          icon: "save",
          type: "parent",
          label: "Save As...",
          items: [
            {
              id: "saveAsWorkspace",
              type: "leaf",
              label: "PDW Workspace",
              action: { onClick: () => executeCommand("saveAsWorkspace") },
            },
            {
              id: "saveAsJpeg",
              type: "leaf",
              label: "JPEG Picture",
              action: { onClick: () => executeCommand("saveAsJpeg") },
            },
            {
              id: "saveAsPng",
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
        itemFromCommand("undoCanvasAction", executeCommand),
        itemFromCommand("redoCanvasAction", executeCommand),
        { type: "separator" },
        itemFromCommand("copyImage", executeCommand),
        itemFromCommand("pasteImage", executeCommand),
      ],
    },
    {
      type: "parent",
      label: "Layers",
      items: [
        itemFromCommand("addLayer", executeCommand),
        itemFromCommand("duplicateLayer", executeCommand),
        itemFromCommand(
          "moveLayerUp",
          executeCommand,
          activeLayerIndex === layers.length - 1
        ),
        itemFromCommand(
          "moveLayerDown",
          executeCommand,
          activeLayerIndex === 0
        ),
        itemFromCommand("removeLayer", executeCommand),
        { type: "separator" },
        itemFromCommand("hideLayer", executeCommand),
        itemFromCommand("showLayer", executeCommand),
      ],
    },
    {
      type: "parent",
      label: translations.adjustments.name,
      items: [
        itemFromCommand("openCropCanvasDialog", executeCommand),
        itemFromCommand("openSmartCropDialog", executeCommand),
        itemFromCommand("openResizeCanvasDialog", executeCommand),
        { type: "separator" },
        ...Object.entries(adjustmentsMetadata).map(
          ([id, metadata]) =>
            ({
              type: "leaf",
              label: metadata.name,
              action: {
                onClick: () =>
                  executeCommand("openAdjustmentsPopup", {
                    adjustmentId: id as AdjustmentId,
                  }),
              },
            } as const)
        ),
      ],
    },
    {
      type: "parent",
      label: translations.models.name,
      items: [
        itemFromCommand("openLabelObjectsDialog", executeCommand),
        itemFromCommand("openTextToImageDialog", executeCommand),
      ],
    },
  ];
};

