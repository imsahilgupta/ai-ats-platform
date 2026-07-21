import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeatureSection({
  id,
  title,
  description,
  benefits,
  workflow,
  visual,
  reverse = false,
}: {
  id?: string;
  title: string;
  description: string;
  benefits: string[];
  workflow: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <div className={cn("grid items-center gap-10 lg:grid-cols-2", reverse && "lg:[&>*:first-child]:order-2")}>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h2>
          <p className="mt-3 text-muted-foreground">{description}</p>

          <div className="mt-6">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Benefits</p>
            <ul className="mt-2 space-y-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">How it works</p>
            <ol className="mt-2 space-y-1.5">
              {workflow.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <Button className="mt-6" render={<Link href="/register" />}>
            Try it free
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">{visual}</div>
      </div>
    </section>
  );
}
