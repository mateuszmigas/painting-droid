import { createKeyGesture } from "@/utils/keyGesture";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { isWindows } from "@/utils/platform";
import { getTranslations } from "@/translations";
import { clipboard } from "@/utils/clipboard";
import { uuid } from "@/utils/uuid";

const translations = getTranslations();

export const command = createCommand({
  id: "pasteImage",
  display: translations.commands.pasteImage,
  icon: "clipboard-paste",
  defaultKeyGesture: isWindows()
    ? createKeyGesture({ key: "V", ctrl: true })
    : createKeyGesture({ key: "V", meta: true }),
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    const data = await clipboard.pasteImage();

    if (!data) {
      return;
    }

    await context.canvasActionDispatcher.execute("drawOverlayShape", {
      display: translations.commands.pasteImage,
      icon: "clipboard-paste",
      overlayShape: {
        id: uuid(),
        type: "rectangle",
        boundingBox: { x: 0, y: 0, width: data.width, height: data.height },
        captured: { box: { x: 0, y: 0, width: 0, height: 0 }, data },
      },
    });
  },
});

