"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Play } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UsageLimitBanner } from "@/components/shared/usage-limit-banner";
import { startMockInterviewSession } from "@/lib/api/mockInterview";
import { EXPERIENCE_LEVELS, INTERVIEW_TYPES } from "@/lib/constants";
import { qk } from "@/lib/query/keys";
import type { InterviewType } from "@/types/mockInterview";
import { ApiError } from "@/types/api";

export function InterviewSetupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<string>(EXPERIENCE_LEVELS[1].value);
  const [interviewType, setInterviewType] = useState<InterviewType>("technical");
  const [limitInfo, setLimitInfo] = useState<{ limit?: number; resetAt?: string } | null>(null);

  const mutation = useMutation({
    mutationFn: startMockInterviewSession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: qk.subscription() });
      router.push(`/mock-interview/${data.session._id}`);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 403) {
        setLimitInfo({ limit: error.body.limit, resetAt: error.body.resetAt });
        return;
      }
      toast.error(
        error instanceof ApiError
          ? error.body.message
          : "The AI is temporarily unavailable. Please try again.",
      );
    },
  });

  if (limitInfo) {
    return <UsageLimitBanner limit={limitInfo.limit} resetAt={limitInfo.resetAt} />;
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!role.trim()) return;
        mutation.mutate({ role, experienceLevel, interviewType });
      }}
    >
      <div>
        <Label htmlFor="role" className="mb-2">
          Target role
        </Label>
        <Input
          id="role"
          placeholder="e.g. Senior Frontend Engineer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-2">Experience level</Label>
          <Select value={experienceLevel} onValueChange={(v) => v && setExperienceLevel(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2">Interview type</Label>
          <Select value={interviewType} onValueChange={(v) => v && setInterviewType(v as InterviewType)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INTERVIEW_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {INTERVIEW_TYPES.map((type) => (
          <button
            type="button"
            key={type.value}
            onClick={() => setInterviewType(type.value)}
            className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
              interviewType === type.value
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            <p className="font-medium">{type.label}</p>
            <p className="mt-0.5 text-[11px] opacity-80">{type.description}</p>
          </button>
        ))}
      </div>

      <Button type="submit" size="lg" disabled={!role.trim() || mutation.isPending}>
        {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
        Start mock interview
      </Button>
    </form>
  );
}
