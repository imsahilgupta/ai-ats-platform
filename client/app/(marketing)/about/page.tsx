import type { Metadata } from "next";
import { RoleAvatar } from "@/components/shared/role-avatar";
import { CtaSection } from "@/components/marketing/cta-section";
import { CORE_VALUES, COMPANY_TIMELINE, TEAM_MEMBERS, TECH_STACK } from "@/lib/data/marketing";

export const metadata: Metadata = { title: "About — MockMate.AI" };

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          We help candidates walk into interviews prepared, not anxious
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          MockMate.AI started with a simple observation: most interview prep is either expensive human coaching
          or generic question lists. We built an AI that gives every candidate honest, specific feedback &mdash;
          at a price anyone can afford.
        </p>
      </section>

      <section className="border-y border-border bg-card/50 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-2 sm:px-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Our mission</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              To make world-class interview preparation accessible to every job seeker, regardless of their
              network or budget.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Our vision</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A world where getting hired depends on your skills and potential &mdash; not on who can afford
              the best interview coach.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-semibold text-foreground">Our story</h2>
        <div className="mt-10 space-y-6">
          {COMPANY_TIMELINE.map((entry, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-16 shrink-0 text-sm font-semibold text-primary">{entry.year}</div>
              <div className="border-l border-border pb-6 pl-4">
                <p className="text-sm font-medium text-foreground">{entry.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold text-foreground">Core values</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((value) => (
              <div key={value.title} className="rounded-xl border border-border bg-card p-5">
                <p className="text-sm font-semibold text-foreground">{value.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-semibold text-foreground">Technology stack</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {TECH_STACK.map((tech) => (
            <span key={tech} className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold text-foreground">Team</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} className="flex flex-col items-center gap-3 text-center">
                <RoleAvatar name={member.initials} size="size-16" />
                <div>
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
