import { LocalStorageStateKeeper } from "./state-keeper/localStorageStateKeeper";
import { StateKeeper } from "./state-keeper/stateKeeper";

export const stateKeeper: StateKeeper = new LocalStorageStateKeeper();

