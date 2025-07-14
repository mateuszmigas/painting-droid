import { createContext, useContext } from "react";
import { toast } from "sonner";

type NotificationOptions = {
  action?: {
    label: string;
    onClick: () => void;
  };
};

export class NotificationService {
  showInfo(message: string, options?: NotificationOptions) {
    toast(message, options);
  }
  showError(message: string) {
    toast.error(message);
  }
  showSuccess(message: string) {
    toast.success(message);
  }
}

export const notificationService = new NotificationService();

export const NotificationServiceContext = createContext<NotificationService>(notificationService);

export const useNotificationService = () => useContext<NotificationService>(NotificationServiceContext);
