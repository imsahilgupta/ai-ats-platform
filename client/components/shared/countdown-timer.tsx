import { useCountdown } from "@/hooks/use-countdown";

export function CountdownTimer({ target, prefix = "Resets in" }: { target: Date | string; prefix?: string }) {
  const { days, hours, isPast } = useCountdown(target);

  if (isPast) return <span>Resets shortly</span>;

  return (
    <span>
      {prefix} {days > 0 ? `${days}d ${hours}h` : `${hours}h`}
    </span>
  );
}
