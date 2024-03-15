/* based on https://github.com/direntdev/dirent */
import { Dialog } from "@/components/ui/dialog";
import { DialogServiceContext } from "@/contexts/dialogService";
import { useListener } from "@/hooks";
import { Observable } from "@/utils/observable";
import { memo, useMemo, useState } from "react";

type DialogHandle = {
  renderer: () => React.ReactNode;
  close: () => void;
};

type InferCloseParam<P> = P extends { close: (result: infer R) => void }
  ? R
  : never;

export type DialogService = {
  openDialog: <P, R = InferCloseParam<P>>(
    Component: React.ComponentType<P>,
    props: Omit<P, "close">
  ) => Promise<R>;
};

export const DialogHost = memo((props: { children: React.ReactNode }) => {
  const { children } = props;
  const [open, setOpen] = useState(false);

  const dialogHandle = useMemo(
    () => new Observable<DialogHandle | null>(null),
    []
  );

  const dialogService = useMemo(() => {
    return {
      openDialog: <P, R = InferCloseParam<P>>(
        Component: React.ComponentType<P>,
        props: Omit<P, "close">
      ) =>
        new Promise<R>((resolve) => {
          const close = (result?: R) => {
            dialogHandle.setValue(null);
            resolve(result as never);
          };
          const renderer = () => <Component {...(props as P)} close={close} />;
          dialogHandle.setValue({ renderer, close });
        }),
    };
  }, [dialogHandle]);

  useListener(dialogHandle, (handle) => setOpen(!!handle), {
    triggerOnMount: true,
  });

  return (
    <DialogServiceContext.Provider value={dialogService}>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          !open && dialogHandle.getValue()?.close();
        }}
      >
        {dialogHandle.getValue()?.renderer()}
      </Dialog>
      {children}
    </DialogServiceContext.Provider>
  );
});

