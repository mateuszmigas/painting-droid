import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { createSyncStorage } from "./syncStorage";

type AppNotificationState = {
  desktopVersionAvailableNotified: boolean;
};

const defaultState: AppNotificationState = {
  desktopVersionAvailableNotified: false,
};

type AppNotificationSlice = AppNotificationState & {
  setDesktopVersionAvailableNotified: (notified: boolean) => void;
};

export const notificationStoreCreator: StateCreator<AppNotificationSlice> = (
  set
) => ({
  ...defaultState,
  setDesktopVersionAvailableNotified: (notified) =>
    set({ desktopVersionAvailableNotified: notified }),
});

export const useNotificationsStore = create<AppNotificationSlice>()(
  persist(
    notificationStoreCreator,
    createSyncStorage({ version: 4, name: "notifications" })
  )
);

