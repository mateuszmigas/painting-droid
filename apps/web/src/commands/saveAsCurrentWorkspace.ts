import { downloadAsFile } from "@/utils/html";
import { CommandContext } from "./context";

export const command = {
  name: "saveCurrentWorkspaceAsFile",
  description: "Save the current workspace as a new file",
  execute: async (
    _: CommandContext,
    payload: {
      workspaceId: string;
      layerName: string;
      format: "jpeg" | "png";
    }
  ) => {
    const { format } = payload;
    const canvas = document.querySelector(
      "#canvas-renderer"
    ) as HTMLCanvasElement;
    const data = canvas.toDataURL(`image/${format}`, 1.0);
    downloadAsFile(data, `picture.${format}`);
  },
} as const;

