import { type RefObject, useEffect } from "react";

export const useScrollAndFocus = (focus: boolean, inputRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const input = inputRef.current;
    if (input && focus) {
      input.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Focus input after scroll or it won't work
      setTimeout(() => input.focus(), 250);
    }
  }, [focus, inputRef]);
};
