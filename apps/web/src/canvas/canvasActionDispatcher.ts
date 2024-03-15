import { canvasActions } from "./actions";
import type { CanvasAction } from "./actions/action";
import type { CanvasState2 } from "./canvasState";

type CanvasStore = {
  getState: () => CanvasState2;
  setState: (newState: CanvasState2) => void;
};
type ActionName = keyof typeof canvasActions;
type GetActionPayload<T extends ActionName> = Parameters<
  (typeof canvasActions)[T]
>[1];

export class CanvasActionDispatcher {
  private actionsStack: Array<CanvasAction> = [];
  private actionsCursor = -1;
  private store: CanvasStore | undefined;

  attachExternalStore(store: CanvasStore) {
    this.store = store;
  }

  async execute<T extends ActionName>(name: T, payload: GetActionPayload<T>) {
    if (!this.store) {
      throw new Error("No store attached");
    }

    const context = {
      getState: this.store.getState,
    };

    const action = canvasActions[name](context, payload as never);
    const newState = await action.execute(this.store.getState());
    this.store.setState(newState);
    this.actionsCursor++;
    this.actionsStack = this.actionsStack.slice(0, this.actionsCursor);
    this.actionsStack.push(action);
    this.notify();
  }

  async undo() {
    if (!this.store) {
      throw new Error("No store attached");
    }

    if (this.actionsCursor === -1) {
      return;
    }

    const action = this.actionsStack[this.actionsCursor];
    const newState = await action.undo(this.store.getState());
    this.store.setState(newState);
    this.actionsCursor--;
    this.notify();
  }

  async redo() {
    if (!this.store) {
      throw new Error("No store attached");
    }

    if (this.actionsCursor === this.actionsStack.length - 1) {
      return;
    }

    this.actionsCursor++;
    const action = this.actionsStack[this.actionsCursor];
    const newState = await action.execute(this.store.getState());
    this.store.setState(newState);
    this.notify();
  }

  private notify() {
    console.log({
      actionsStack: this.actionsStack,
      actionsCursor: this.actionsCursor,
    });
  }
}

export const canvasActionDispatcher = new CanvasActionDispatcher();

