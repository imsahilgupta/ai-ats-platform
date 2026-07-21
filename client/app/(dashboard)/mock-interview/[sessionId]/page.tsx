"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { RoundProgress } from "@/components/dashboard/mock-interview/round-progress";
import { LiveInterviewChat } from "@/components/dashboard/mock-interview/live-interview-chat";
import { AnswerComposer } from "@/components/dashboard/mock-interview/answer-composer";
import { getMockInterviewResult, submitMockInterviewAnswer } from "@/lib/api/mockInterview";
import { qk } from "@/lib/query/keys";
import { ApiError } from "@/types/api";

export default function MockInterviewLivePage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isRetryable, setIsRetryable] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: qk.mockInterviewSession(sessionId),
    queryFn: () => getMockInterviewResult(sessionId),
  });

  const session = data?.session;
  const currentRound = session ? session.chatHistory.filter((t) => t.role === "interviewer").length : 0;

  useEffect(() => {
    if (session?.status === "completed") {
      router.replace(`/mock-interview/${sessionId}/result`);
    }
  }, [session?.status, sessionId, router]);

  const mutation = useMutation({
    mutationFn: submitMockInterviewAnswer,
    onSuccess: (result) => {
      setIsRetryable(false);
      queryClient.setQueryData(qk.mockInterviewSession(sessionId), { session: result.session });
      if (result.completed) {
        queryClient.invalidateQueries({ queryKey: qk.analytics() });
        queryClient.invalidateQueries({ queryKey: qk.subscription() });
        router.push(`/mock-interview/${sessionId}/result`);
      }
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 503) {
        setIsRetryable(true);
        return;
      }
      toast.error(error instanceof ApiError ? error.body.message : "Something went wrong. Please try again.");
    },
  });

  if (isLoading || !session) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (session.status === "completed") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title={`${session.role} — ${session.interviewType} interview`}
        description="Answer each question as you would in a real interview. You can take your time."
      />

      <RoundProgress currentRound={currentRound} />

      <div className="rounded-xl border border-border bg-card p-4">
        <LiveInterviewChat chatHistory={session.chatHistory} />
      </div>

      <AnswerComposer
        key={currentRound}
        onSubmit={(answer, durationSeconds) => mutation.mutate({ sessionId, answer, durationSeconds })}
        isSubmitting={mutation.isPending}
        isRetryable={isRetryable}
      />
    </div>
  );
}
