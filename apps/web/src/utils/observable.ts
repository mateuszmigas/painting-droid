type Subscriber<T> = (data: T) => void;

export class Observable<T> {
  private listeners: Subscriber<T>[] = [];

  constructor(private data: T) {}

  subscribe(listener: Subscriber<T>) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter(
        (subscriber) => subscriber !== listener
      );
    };
  }

  getValue() {
    return this.data;
  }

  setValue(data: T) {
    this.data = data;
    this.notify();
  }

  setValueWithoutNotify(data: T) {
    this.data = data;
  }

  notify() {
    this.listeners.forEach((observer) => observer(this.data));
  }
}
