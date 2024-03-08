import { downloadAsFile } from "@/utils/html";
import { CommandContext } from "./context";
import { createCommand } from "./createCommand";

export const command = createCommand({
  id: "saveCurrentWorkspaceAsFile",
  name: "Save Current Workspace As File",
  icon: "save",
  options: { showInPalette: true },
  execute: async (
    _: CommandContext,
    payload: {
      format: "jpeg" | "png";
    } = { format: "jpeg" }
  ) => {
    const { format } = payload;
    const canvas = document.querySelector(
      "#canvas-renderer"
    ) as HTMLCanvasElement;
    const data = canvas.toDataURL(`image/${format}`, 1.0);
    downloadAsFile(data, `picture.${format}`);
  },
});

