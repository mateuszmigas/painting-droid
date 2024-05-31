import type { AlertService } from "@/components/alertHost";
import { createContext, useContext } from "react";

export const AlertServiceContext = createContext<AlertService>(
  undefined as unknown as AlertService
);

export const useAlertService = () =>
  useContext<AlertService>(AlertServiceContext);
