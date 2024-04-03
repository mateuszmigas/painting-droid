import { toast } from "@/components/ui/use-toast";
import { createContext, useContext } from "react";

export class NotificationService {
  showInfo(title: string, description: string) {
    toast({ title, description });
  }
}

export const notificationService = new NotificationService();

export const NotificationServiceContext =
  createContext<NotificationService>(notificationService);

export const useNotificationService = () =>
  useContext<NotificationService>(NotificationServiceContext);
