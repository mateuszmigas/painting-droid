import { AppState } from "@/store/state";

export type PersistedState = {
  version: string;
  state: Omit<AppState, "session">;
};
