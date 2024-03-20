import { downloadAsFile } from "@/utils/html";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import { workspaceFormat, workspaceFormatVersion } from "@/contants";

export const command = createCommand({
  id: "saveAsWorkspace",
  display: "Save As Workspace (PDW)",
  icon: "save",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const { canvasData, name, size } = activeWorkspaceSelector(
      context.stores.workspaces()
    );
    const blob = new Blob(
      [
        JSON.stringify({
          version: workspaceFormatVersion,
          size,
          data: canvasData,
        }),
      ],
      { type: "text/plain" }
    );
    downloadAsFile(URL.createObjectURL(blob), `${name}.${workspaceFormat}`);
  },
});
