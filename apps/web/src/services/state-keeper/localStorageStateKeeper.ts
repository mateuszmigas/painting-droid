import { StateKeeper } from "./stateKeeper";
import { PersistedState } from "./persistedState";

const localStorageKey = "painting-droid-state";

export class LocalStorageStateKeeper implements StateKeeper {
  async load() {
    const state = localStorage.getItem(localStorageKey);
    if (state) {
      return JSON.parse(state).state as PersistedState;
    } else {
      return null;
    }
  }
  save(state: PersistedState): Promise<void> {
    return new Promise((resolve) => {
      localStorage.setItem(localStorageKey, JSON.stringify(state));
      resolve();
    });
  }
}

