import { createContext, useContext } from "react";
import type { DialogService } from "@/components/dialogHost";

export const DialogServiceContext = createContext<DialogService>(undefined as unknown as DialogService);

export const useDialogService = () => useContext<DialogService>(DialogServiceContext);
