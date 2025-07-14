export const createFrameTicker = (callback: (sinceLastTickMs: number, isLastTick?: boolean) => void) => {
  let rafHandle = 0;
  let start = 0;

  return {
    start: () => {
      start = Date.now();
      const loop = (time: number) => {
        callback(time - start);
        rafHandle = requestAnimationFrame(loop);
      };
      rafHandle = requestAnimationFrame(loop);
    },
    stop: () => {
      callback(Date.now() - start, true);
      cancelAnimationFrame(rafHandle);
    },
    cancel: () => {
      cancelAnimationFrame(rafHandle);
    },
  };
};
export type FrameTicker = ReturnType<typeof createFrameTicker>;
