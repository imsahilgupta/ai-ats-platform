import type { Metadata } from "next";
import { Mic, BarChart3, Trophy, CreditCard, MessageSquare, Code2 } from "lucide-react";

import { FeatureSection } from "@/components/marketing/feature-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { ScoreGauge } from "@/components/shared/score-gauge";
import { SeverityChip } from "@/components/shared/severity-chip";
import { BadgeCard } from "@/components/shared/badge-card";
import { XpProgressBar } from "@/components/shared/xp-progress-bar";
import { StatTile } from "@/components/shared/stat-tile";
import { RadarSkillChart } from "@/components/shared/radar-skill-chart";

export const metadata: Metadata = { title: "Features — MockMate.AI" };

export default function FeaturesPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Every tool you need to prepare, in one platform
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          From your first mock interview to your final offer &mdash; explore what MockMate.AI can do for you.
        </p>
      </section>

      <FeatureSection
        id="mock-interview"
        title="AI Mock Interview"
        description="Practice live with an AI interviewer across technical and behavioral rounds, tailored to your target role and experience level."
        benefits={[
          "Technical interview preparation with real coding and systems questions",
          "Behavioral interview preparation using realistic follow-up questions",
          "Instant per-answer scoring and constructive feedback",
          "Communication scoring: confidence, clarity, and pace",
        ]}
        workflow={[
          "Choose your target role, experience level, and interview type",
          "Answer 5 rounds of AI-generated questions",
          "Get an overall score, feedback report, and full transcript",
        ]}
        visual={
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
              <Code2 className="size-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                &ldquo;Can you explain how the JavaScript event loop handles async operations?&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
              <MessageSquare className="size-4 text-primary" />
              <p className="text-sm text-muted-foreground">Score: 82/100 &mdash; Strong grasp of core concepts.</p>
            </div>
            <div className="flex justify-center">
              <ScoreGauge value={82} label="Overall" />
            </div>
          </div>
        }
      />

      <FeatureSection
        id="resume-analyzer"
        title="Resume ATS Analyzer"
        description="Upload your resume and a target job description to get an ATS match score, missing keywords, and rewritten bullet points."
        reverse
        benefits={[
          "ATS match score out of 100, scored the way real ATS systems parse resumes",
          "Missing keyword detection against your target job description",
          "Formatting issue detection",
          "Before/after bullet-point rewrites",
        ]}
        workflow={[
          "Upload your resume (PDF/DOCX) or paste the text",
          "Paste the job description you're targeting",
          "Get your ATS score, keyword gaps, and improvement suggestions",
        ]}
        visual={
          <div className="flex flex-col items-center gap-4">
            <ScoreGauge value={68} label="ATS score" />
            <div className="flex flex-wrap justify-center gap-1.5">
              {["TypeScript", "GraphQL", "System Design"].map((kw) => (
                <span key={kw} className="rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        }
      />

      <FeatureSection
        id="career-roadmap"
        title="AI Career Strategy & Roadmap"
        description="Get a personalized skill gap analysis and a weekly preparation plan built around the exact role you're targeting."
        benefits={[
          "Skill gap analysis with prioritized severity levels",
          "A day-by-day weekly preparation roadmap",
          "Model technical and behavioral answers",
          "Downloadable tailored resume",
        ]}
        workflow={[
          "Share your resume, background, and target job description",
          "Get your match score and skill gaps",
          "Follow your personalized weekly roadmap",
        ]}
        visual={
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
              <span className="text-sm text-foreground">System Design at Scale</span>
              <SeverityChip severity="high" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
              <span className="text-sm text-foreground">Advanced Performance Optimization</span>
              <SeverityChip severity="medium" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
              <span className="text-sm text-foreground">Communication Fundamentals</span>
              <SeverityChip severity="low" />
            </div>
          </div>
        }
      />

      <FeatureSection
        id="analytics"
        title="Analytics Dashboard & Progress Tracking"
        description="Track your performance trends across every interview type and watch your resume score improve session over session."
        reverse
        benefits={[
          "Skill breakdown across technical, behavioral, and HR rounds",
          "Session history with score trends over time",
          "Resume score tracking across every version",
          "XP and level progress at a glance",
        ]}
        workflow={[
          "Complete mock interviews and resume analyses",
          "Analytics update automatically after every session",
          "Review trends to see exactly where to focus next",
        ]}
        visual={
          <div className="grid gap-4 sm:grid-cols-2">
            <RadarSkillChart performance={{ technical: 82, behavioral: 74, hr: 88, overall: 81 }} />
            <div className="grid gap-3">
              <StatTile label="Overall performance" value={81} icon={BarChart3} hint="out of 100" />
              <StatTile label="Sessions completed" value={14} icon={Mic} />
            </div>
          </div>
        }
      />

      <FeatureSection
        id="gamification"
        title="Gamification"
        description="Stay motivated with XP, levels, and badges that reward consistent practice."
        benefits={[
          "Earn XP for every answer and completed session",
          "Level up as you accumulate experience",
          "Unlock badges for hitting practice milestones",
        ]}
        workflow={[
          "Complete mock interview rounds to earn XP",
          "Level up automatically every 1,000 XP",
          "Unlock badges as you hit key milestones",
        ]}
        visual={
          <div className="space-y-4">
            <XpProgressBar xp={2450} level={3} />
            <div className="grid grid-cols-2 gap-3">
              <BadgeCard name="Interview Rookie" icon="🥉" description="Reach 500 XP" earned dateEarned={new Date().toISOString()} />
              <BadgeCard name="Interview Specialist" icon="🥈" description="Reach 2,000 XP" earned dateEarned={new Date().toISOString()} />
            </div>
          </div>
        }
      />

      <FeatureSection
        id="subscription-plans"
        title="Subscription Plans"
        description="Start free, and upgrade to PRO for unlimited mock interviews whenever you're ready to practice more."
        reverse
        benefits={[
          "FREE plan with 3 mock interviews per month",
          "PRO plan with unlimited mock interviews and priority AI responses",
          "ENTERPRISE plan for teams and career centers",
          "Pay with eSewa",
        ]}
        workflow={[
          "Start on the FREE plan — no credit card required",
          "Upgrade anytime from your subscription settings",
          "Cancel or downgrade whenever you'd like",
        ]}
        visual={
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CreditCard className="size-6" />
            </span>
            <p className="text-sm text-muted-foreground">Plans starting at NPR 0/month</p>
            <Trophy className="size-5 text-gamification" />
          </div>
        }
      />

      <CtaSection />
    </>
  );
}
