import { useEffect, useState } from "react";

export function useCountdown(target: Date | string) {
  const targetTime = new Date(target).getTime();
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, targetTime - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(Math.max(0, targetTime - Date.now()));
    }, 60_000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);

  return { remainingMs, days, hours, isPast: remainingMs <= 0 };
}
