import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(140deg,var(--primary)_0%,color-mix(in_oklab,var(--primary)_60%,black)_100%)] px-6 py-14 text-center sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]"
        />
        <h2 className="relative text-3xl font-semibold text-primary-foreground sm:text-4xl">
          Ready to walk into your next interview prepared?
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-primary-foreground/80">
          Join thousands of candidates using MockMate.AI to practice smarter and get hired faster.
        </p>
        <Button size="lg" variant="secondary" className="relative mt-8" render={<Link href="/register" />}>
          Start free today
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
