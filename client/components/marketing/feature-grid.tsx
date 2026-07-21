import {
  BarChart3,
  Compass,
  FileScan,
  Mic,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { PLATFORM_FEATURES } from "@/lib/data/marketing";

const ICONS: Record<string, LucideIcon> = { Mic, FileScan, Compass, BarChart3, Trophy, TrendingUp };

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Everything you need to prepare
        </h2>
        <p className="mt-3 text-muted-foreground">
          One platform for every part of your job search &mdash; from your resume to your final interview.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORM_FEATURES.map((feature) => {
          const Icon = ICONS[feature.icon];
          return (
            <div key={feature.title} className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
