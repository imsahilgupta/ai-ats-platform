"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(600px_circle_at_20%_0%,color-mix(in_oklab,var(--primary)_15%,transparent),transparent_60%),radial-gradient(500px_circle_at_90%_20%,color-mix(in_oklab,var(--gamification)_12%,transparent),transparent_60%)]"
      />

      <div className="mx-auto max-w-6xl px-4 pt-16 pb-8 text-center sm:px-6 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          Now with AI-powered career strategy reports
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          Ace your next interview with an AI that actually prepares you
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          Practice live mock interviews, get your resume past ATS filters, and follow a personalized
          career strategy &mdash; all powered by AI that gives you real, actionable feedback.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button size="lg" render={<Link href="/register" />}>
            Start free
            <ArrowRight className="size-4" />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="#how-it-works" />}>
            <PlayCircle className="size-4" />
            Watch demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-16"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}
