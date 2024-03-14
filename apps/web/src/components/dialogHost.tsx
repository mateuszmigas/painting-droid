/* based on https://github.com/direntdev/dirent */
import { Dialog } from "@/components/ui/dialog";
import { useListener } from "@/hooks";
import { Observable } from "@/utils/observable";
import { useRef, useState } from "react";

type DialogHandle = {
  renderer: () => React.ReactNode;
  close: () => void;
};
const dialogHandle = new Observable<DialogHandle | null>(null);

type InferCloseParam<P> = P extends { close: (result: infer R) => void }
  ? R
  : never;

const open = <P, R = InferCloseParam<P>>(
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
  });

export const dialogManager = { open };

export const DialogHost = () => {
  const dialogHandleRef = useRef<DialogHandle | null>(null);
  const [open, setOpen] = useState(false);

  useListener(
    dialogHandle,
    (handle) => {
      dialogHandleRef.current = handle;
      setOpen(!!handle);
    },
    { triggerOnMount: true }
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        !open && dialogHandleRef.current?.close();
      }}
    >
      {dialogHandleRef.current?.renderer()}
    </Dialog>
  );
};

