import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";
import { isDesktop } from "@/utils/platform";
import { getTranslations } from "@/translations";
import { notificationService } from "@/contexts/notificationService";
import { checkForUpdates } from "@/utils/updater";

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

    notificationService.showInfo(
      `${translations.updater.available}: v${update.version}`,
      {
        action: {
          label: translations.updater.install,
          onClick: install,
        },
      }
    );
  },
});

