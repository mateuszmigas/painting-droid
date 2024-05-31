import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { getTranslations } from "@/translations";
import { selectLayersAsBlob } from "./selectors/workspace";
import { features } from "@/features";

const translations = getTranslations();

export const command = createCommand({
  id: "shareWorkspace",
  display: translations.commands.shareWorkspace,
  icon: "share",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    if (!features.shareFiles) {
      context.notificationService.showError(
        translations.errors.sharingNotSupported
      );
      return;
    }
    const format = "jpeg";
    const { name, blob } = await selectLayersAsBlob(
      context.stores.workspaces(),
      format
    );
    const file = new File([blob], `${name}.${format}`, {
      type: `image/${format}`,
    });
    navigator.share({ files: [file] });
  },
});

