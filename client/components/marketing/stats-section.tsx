import { SUCCESS_STATS } from "@/lib/data/marketing";

export function StatsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-6 rounded-2xl border border-border bg-card p-8 sm:grid-cols-4">
        {SUCCESS_STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-semibold tabular-nums text-primary sm:text-4xl">{stat.value}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
