import { createContext, useContext } from "react";
import { toast } from "sonner";

export class NotificationService {
  showInfo(message: string) {
    toast.info(message);
  }
  showError(message: string) {
    toast.error(message);
  }
  showSuccess(message: string) {
    toast.success(message);
  }
}

export const notificationService = new NotificationService();

export const NotificationServiceContext =
  createContext<NotificationService>(notificationService);

export const useNotificationService = () =>
  useContext<NotificationService>(NotificationServiceContext);
