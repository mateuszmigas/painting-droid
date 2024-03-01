import { PersistedState } from "./persistedState";

export interface StateKeeper {
  load(): Promise<PersistedState | null>;
  save(state: PersistedState): Promise<void>;
}

