import { useObservable } from ".";
import { useEffect } from "react";

export const useObservableWatcher = <T>(
  currentValue: T,
  equalityFn: (a: T, b: T) => boolean = (a, b) => a === b
) => {
  const observable = useObservable(currentValue);

  if (!equalityFn(observable.getValue(), currentValue)) {
    observable.setValueWithoutNotify(currentValue);
  }

  //notify subscribers post render
  useEffect(() => {
    observable.notify();
  }, [currentValue, observable]);

  return observable;
};

