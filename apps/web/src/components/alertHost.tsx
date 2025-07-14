import { memo, useEffect, useMemo, useState } from "react";
import { useListener } from "@/hooks";
import { getTranslations } from "@/translations";
import { Observable } from "@/utils/observable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const translations = getTranslations();

type AlertConfirmButton = {
  content: string;
  variant: "default" | "destructive";
};

type AlertHandle = {
  type: "confirm";
  title: string;
  description: string;
  confirmButton: AlertConfirmButton;
  close: (result: boolean | null) => void;
};

export type AlertService = {
  showConfirm: (title: string, description: string, confirmButton?: AlertConfirmButton) => Promise<boolean | null>;
};

export const AlertHost = memo((props: { setAlertService: (alertService: AlertService) => void }) => {
  const { setAlertService } = props;
  const [open, setOpen] = useState(false);

  const alertHandle = useMemo(() => new Observable<AlertHandle | null>(null), []);

  useEffect(() => {
    setAlertService({
      showConfirm: (title: string, description: string, confirmButton?: AlertConfirmButton) => {
        return new Promise<boolean | null>((resolve) => {
          const close = (result: boolean | null) => {
            alertHandle.setValue(null);
            resolve(result);
          };
          alertHandle.setValue({
            type: "confirm",
            title,
            description,
            close,
            confirmButton: confirmButton || {
              content: translations.general.continue,
              variant: "default",
            },
          });
        });
      },
    });
  }, [setAlertService, alertHandle]);

  useListener(alertHandle, (handle) => setOpen(!!handle), {
    triggerOnMount: true,
  });

  const alert = alertHandle.getValue();

  return (
    <AlertDialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        open && alert?.close(null);
      }}
    >
      {alert && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alert.title}</AlertDialogTitle>
            <AlertDialogDescription>{alert.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => alert.close(false)}>{translations.general.cancel}</AlertDialogCancel>
            <AlertDialogAction variant={alert.confirmButton.variant} onClick={() => alert.close(true)}>
              {alert.confirmButton.content}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
});
