import type { DialogService } from "@/components/dialogHost";
import { createContext, useContext } from "react";

export const DialogServiceContext = createContext<DialogService>(
  undefined as unknown as DialogService
);

export const useDialogService = () =>
  useContext<DialogService>(DialogServiceContext);

