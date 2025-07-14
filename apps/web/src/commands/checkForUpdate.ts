import { notificationService } from "@/contexts/notificationService";
import { getTranslations } from "@/translations";
import { isDesktop } from "@/utils/platform";
import { checkForUpdates } from "@/utils/updater";
import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

const translations = getTranslations();

export const command = createCommand({
  id: "checkForUpdate",
  display: translations.commands.checkForUpdate,
  icon: "download",
  config: { showInPalette: isDesktop() },
  execute: async (_: CommandContext) => {
    const update = await checkForUpdates();

    if (!update) {
      notificationService.showInfo(translations.updater.notAvailable);
      return;
    }

    const install = async () => {
      await update.downloadAndInstall();
      notificationService.showInfo(translations.updater.installed, {
        action: {
          label: translations.updater.restart,
          onClick: () => update.restart(),
        },
      });
    };

    notificationService.showInfo(`${translations.updater.available}: v${update.version}`, {
      action: {
        label: translations.updater.install,
        onClick: install,
      },
    });
  },
});
