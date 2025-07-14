import { createContext, useContext } from "react";
import type { CommandService } from "@/components/commandPaletteHost";

export const CommandServiceContext = createContext<CommandService>(undefined as unknown as CommandService);

export const useCommandService = () => useContext<CommandService>(CommandServiceContext);
