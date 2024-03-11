export class PromiseQueue {
  private promises: (() => Promise<unknown>)[] = [];
  private processing = false;

  public push(promise: () => Promise<unknown>) {
    this.promises.push(promise);
    this.process();
  }

  private process() {
    if (this.processing || this.promises.length === 0) {
      return;
    }

    this.processing = true;

    const promise = this.promises.shift();

    if (!promise) return;

    promise().finally(() => {
      this.processing = false;
      this.process();
    });
  }
}

