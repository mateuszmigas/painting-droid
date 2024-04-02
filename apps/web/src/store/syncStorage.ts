import { createJSONStorage } from "zustand/middleware";

export const createSyncStorage = (options: {
  name: string;
  version: number;
}) => {
  return {
    ...options,
    storage: createJSONStorage(() => localStorage),
  };
};
