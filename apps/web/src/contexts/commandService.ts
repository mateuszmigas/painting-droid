import type { CommandService } from "@/components/commandPaletteHost";
import { createContext, useContext } from "react";

export const CommandServiceContext = createContext<CommandService>(
  undefined as unknown as CommandService
);

export const useCommandService = () =>
  useContext<CommandService>(CommandServiceContext);

