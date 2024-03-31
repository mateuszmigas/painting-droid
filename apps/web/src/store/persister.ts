import { createJSONStorage } from "zustand/middleware";

export const createPersister = (options: { name: string; version: number }) => {
  return {
    ...options,
    storage: createJSONStorage(() => localStorage),
  };
};

