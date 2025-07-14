import { features } from "@/features";
import { getTranslations } from "@/translations";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { selectWorkspaceAsImage } from "./selectors/workspace";

const translations = getTranslations();

export const command = createCommand({
  id: "shareWorkspace",
  display: translations.commands.shareWorkspace,
  icon: "share",
  config: { showInPalette: true },
  execute: async (context: CommandContext) => {
    if (!features.shareFiles) {
      context.notificationService.showError(translations.errors.sharingNotSupported);
      return;
    }
    const format = "jpeg";
    const { name, blob } = await selectWorkspaceAsImage(context.stores.workspaces(), format);
    const file = new File([blob], `${name}.${format}`, {
      type: `image/${format}`,
    });
    navigator.share({ files: [file] });
  },
});
