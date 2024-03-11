import type { WorkspaceId } from "@/store/workspacesStore";
import type { ImageCompressedData } from "@/utils/imageData";

class WorkspaceCanvasHistory {
  private history: Map<WorkspaceId, ImageCompressedData> = new Map();

  push(workspaceId: WorkspaceId, data: ImageCompressedData) {
    // console.log("pushing", workspaceId);
    this.history.set(workspaceId, data);
  }

  getLatest(workspaceId: WorkspaceId): ImageCompressedData | null {
    // console.log("getting latest", workspaceId);
    return this.history.get(workspaceId) ?? null;
  }

  clear(workspaceId: WorkspaceId) {
    this.history.delete(workspaceId);
  }
}

export const workspaceCanvasHistory = new WorkspaceCanvasHistory();

