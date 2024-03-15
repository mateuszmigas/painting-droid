import { PromiseQueue } from "./../utils/promise";
import { Observable } from "@/utils/observable";
import { canvasActions } from "./actions";
import type { CanvasAction } from "./actions/action";
import type { CanvasState } from "./canvasState";

type CanvasStore = {
  getState: () => CanvasState;
  setState: (newState: CanvasState) => void;
};
type ActionName = keyof typeof canvasActions;
type GetActionPayload<T extends ActionName> = Parameters<
  (typeof canvasActions)[T]
>[1];

type StackInfo = {
  actions: Pick<CanvasAction, "display" | "icon">[];
  cursor: number;
};

const initAction = {
  display: "New Image",
  icon: "file-plus",
} as CanvasAction;

export class CanvasActionDispatcher {
  observableStackInfo = new Observable<StackInfo>({
    actions: [initAction],
    cursor: 0,
  });
  private actionsStack: Array<CanvasAction> = [initAction];
  private actionsCursor = 0;
  private store: CanvasStore | undefined;
  private promiseQueue = new PromiseQueue();

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

    const store = this.store;
    const action = canvasActions[name](context, payload as never);

    this.promiseQueue.push(async () => {
      const newState = await action.execute(store.getState());
      store.setState(newState);
      this.actionsCursor++;
      this.actionsStack = this.actionsStack.slice(0, this.actionsCursor);
      this.actionsStack.push(action);
      this.notifyListeners();
    });
  }

  async undo() {
    if (!this.store) {
      throw new Error("No store attached");
    }

    if (this.actionsCursor === 0) {
      return;
    }

    const store = this.store;
    const action = this.actionsStack[this.actionsCursor];

    this.promiseQueue.push(async () => {
      const newState = await action.undo(store.getState());
      store.setState(newState);
      this.actionsCursor--;
      this.notifyListeners();
    });
  }

  async redo() {
    if (!this.store) {
      throw new Error("No store attached");
    }

    if (this.actionsCursor === this.actionsStack.length - 1) {
      return;
    }

    const store = this.store;
    const action = this.actionsStack[this.actionsCursor];

    this.promiseQueue.push(async () => {
      this.actionsCursor++;
      const newState = await action.execute(store.getState());
      store.setState(newState);
      this.notifyListeners();
    });
  }

  private notifyListeners() {
    const info: StackInfo = {
      actions: this.actionsStack.map((action) => ({
        display: action.display,
        icon: action.icon,
      })),
      cursor: this.actionsCursor,
    };
    this.observableStackInfo.setValue(info);
  }
}
