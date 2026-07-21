import { getPublicStats } from "@/lib/api/analytics";

const compactNumber = new Intl.NumberFormat("en", { notation: "compact" });

export async function StatsSection() {
  const stats = await getPublicStats();

  const tiles = [
    { value: stats ? compactNumber.format(stats.completedMockInterviews) : "—", label: "Mock interviews completed" },
    { value: stats ? compactNumber.format(stats.totalResumes) : "—", label: "Resumes analyzed" },
    { value: stats ? compactNumber.format(stats.careerReports) : "—", label: "Career reports generated" },
    { value: stats ? compactNumber.format(stats.totalUsers) : "—", label: "Candidates using MockMate.AI" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-6 rounded-2xl border border-border bg-card p-8 sm:grid-cols-4">
        {tiles.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-semibold tabular-nums text-primary sm:text-4xl">{stat.value}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
