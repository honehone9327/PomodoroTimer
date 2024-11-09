// shared/utils/timer.ts

export const startTimer = (
    duration: number,
    onTick: (remaining: number) => void,
    onComplete: () => void
  ): (() => void) => {
    let remaining = duration;
    const interval = setInterval(() => {
      remaining -= 1;
      onTick(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);
    return () => clearInterval(interval);
  };
  