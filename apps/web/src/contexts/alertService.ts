import { createContext, useContext } from "react";
import type { AlertService } from "@/components/alertHost";

export const AlertServiceContext = createContext<AlertService>(undefined as unknown as AlertService);

export const useAlertService = () => useContext<AlertService>(AlertServiceContext);
