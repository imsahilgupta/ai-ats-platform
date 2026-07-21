"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreGauge } from "@/components/shared/score-gauge";
import { MarkdownReport } from "@/components/shared/markdown-report";
import { LiveInterviewChat } from "@/components/dashboard/mock-interview/live-interview-chat";
import { CommunicationScoreCard } from "@/components/dashboard/mock-interview/communication-score-card";
import { getMockInterviewResult } from "@/lib/api/mockInterview";
import { qk } from "@/lib/query/keys";

export default function MockInterviewResultPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const { data, isLoading } = useQuery({
    queryKey: qk.mockInterviewSession(sessionId),
    queryFn: () => getMockInterviewResult(sessionId),
  });

  const session = data?.session;

  if (isLoading || !session) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Interview summary"
        description={`${session.role} — ${session.interviewType} interview`}
        action={
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard");
              }}
            >
              Share results
            </Button>
            <Button render={<Link href="/mock-interview" />}>
              <RotateCcw className="size-4" />
              Retry
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
        <div className="flex justify-center rounded-xl border border-border bg-card p-6">
          <ScoreGauge value={session.overallScore ?? 0} size={128} label="Overall" />
        </div>
        {session.communicationScore && <CommunicationScoreCard score={session.communicationScore} />}
      </div>

      {session.feedbackReport && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-3 text-sm font-semibold text-foreground">AI feedback</h3>
          <MarkdownReport content={session.feedbackReport} />
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 px-2 text-sm font-semibold text-foreground">Full transcript</h3>
        <LiveInterviewChat chatHistory={session.chatHistory} />
      </div>
    </div>
  );
}
