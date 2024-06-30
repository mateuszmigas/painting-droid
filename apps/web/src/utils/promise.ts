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

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const makeDeferred = <T>() => {
  let resolve: (value: T) => void = () => {};
  let reject: (reason: unknown) => void = () => {};

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

export type PromiseCancellationToken = {
  isCancellationRequested: () => boolean;
};

export class PromiseCancellationTokenSource {
  private isCanceled = false;
  cancel() {
    this.isCanceled = true;
  }
  getToken(): PromiseCancellationToken {
    return { isCancellationRequested: () => this.isCanceled };
  }
}

export const makeCancellableWithToken = <T>(
  promise: Promise<T>,
  token: PromiseCancellationToken
) =>
  new Promise<T>((resolve, reject) => {
    promise.then(
      (result) => !token.isCancellationRequested() && resolve(result),
      (error) => !token.isCancellationRequested() && reject(error)
    );
  });

