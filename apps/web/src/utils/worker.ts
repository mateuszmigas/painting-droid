//based on https://github.com/mateuszmigas/ts-experiments/blob/master/strong-api.ts
import { uuid } from "./uuid";

export const createProxyServer = (
  workerSelf: Window & typeof globalThis,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  api: Record<string, (...args: any[]) => Promise<unknown>>
) => {
  workerSelf.addEventListener("message", (message: MessageEvent) => {
    const { type, payload, id } = message.data;
    const method = api[type];
    if (!method) {
      throw new Error(`Unknown method ${type}`);
    }
    method(...payload).then((result) => {
      workerSelf.postMessage({ id, result });
    });
  });
};

type ProxyClient<T extends Record<string | symbol | number, unknown>> = {
  [K in keyof T]: T[K] extends (...args: never[]) => unknown ? T[K] : never;
};

export const createProxyClient = <T extends {}>(initWorker: () => Worker) => {
  const callbacks: Map<string, (event: MessageEvent) => void> = new Map();
  let _worker: Worker | null = null;
  const getWorker = () => {
    if (!_worker) {
      _worker = initWorker();
      _worker.addEventListener("message", (event) =>
        callbacks.forEach((callback) => callback(event))
      );
    }
    return _worker;
  };

  const client = {
    //add extra methods here
  };
  const handler: ProxyHandler<typeof client> = {
    get(_, prop) {
      if (Object.prototype.hasOwnProperty.call(client, prop)) {
        return client[prop as keyof typeof client];
      }
      return (...args: unknown[]) => {
        const worker = getWorker();
        const id = uuid();
        worker.postMessage({ id, type: prop, payload: args });
        return new Promise<string>((resolve) => {
          const callback = (event: MessageEvent) => {
            if (event.data.id === id) {
              callbacks.delete(id);
              resolve(event.data.result);
            }
          };
          callbacks.set(id, callback);
        });
      };
    },
  };

  return new Proxy(client, handler) as ProxyClient<T> & typeof client;
};

