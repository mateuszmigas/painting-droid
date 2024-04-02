import { useEffect, useState } from "react";

export const useHasStoreHydrated = (store: {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
  };
}) => {
  const [hasHydrated, setHasHydrated] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: just need to run once
  useEffect(() => {
    if (store.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }

    const unsubscribe = store.persist.onFinishHydration(() =>
      setHasHydrated(true)
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return hasHydrated;
};

