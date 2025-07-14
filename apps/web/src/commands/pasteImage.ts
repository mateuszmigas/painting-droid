import { domNames } from "@/constants";
import { activeWorkspaceSelector } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import { clipboard } from "@/utils/clipboard";
import { createSystemKeyGesture } from "@/utils/keyGesture";
import { calculateMousePosition } from "@/utils/manipulation";
import { observableMousePosition } from "@/utils/mousePositionWatcher";
import { uuid } from "@/utils/uuid";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "pasteImage",
  display: translations.commands.pasteImage,
  icon: "clipboard-paste",
  defaultKeyGesture: createSystemKeyGesture({ key: "V", ctrlOrCmd: true }),
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const data = await clipboard.pasteImage();

    if (!data) {
      return;
    }

    const position = calculateMousePosition(
      activeWorkspaceSelector(context.stores.workspaces()).viewport!,
      observableMousePosition.getValue(),
      document.getElementById(domNames.workspaceViewport)!,
    );

    const { width, height } = await createImageBitmap(data);

    await context.canvasActionDispatcher.execute("addShape", {
      display: translations.commands.pasteImage,
      icon: "clipboard-paste",
      shape: {
        id: uuid(),
        type: "captured-rectangle",
        boundingBox: {
          x: position.x - width / 2,
          y: position.y - height / 2,
          width: width,
          height: height,
        },
        capturedArea: { box: { x: 0, y: 0, width: 0, height: 0 }, data },
      },
    });
  },
});
