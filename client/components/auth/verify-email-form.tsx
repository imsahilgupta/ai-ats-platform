"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resendVerification, verifyEmail } from "@/lib/api/auth";
import { ApiError } from "@/types/api";
import { qk } from "@/lib/query/keys";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const email = searchParams.get("email") ?? "";
  const [code, setCode] = useState("");

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      queryClient.setQueryData(qk.me(), data.user);
      toast.success("Email verified — welcome to MockMate.AI!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.body.message : "Verification failed. Please try again.");
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => resendVerification(email),
    onSuccess: () => toast.success("A new code has been sent to your email"),
    onError: () => toast.error("Failed to resend code. Please try again."),
  });

  if (!email) {
    return (
      <div className="space-y-5 text-center">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t find an email to verify.{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>{" "}
            to get a verification code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim().length === 6) verifyMutation.mutate({ email, code: code.trim() });
        }}
      >
        <div>
          <Label htmlFor="code" className="mb-1.5">
            Verification code
          </Label>
          <Input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            className="text-center text-lg tracking-[0.5em]"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="------"
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={verifyMutation.isPending || code.length !== 6}>
          {verifyMutation.isPending && <Loader2 className="size-4 animate-spin" />}
          Verify email
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Didn&apos;t get a code?{" "}
        <button
          type="button"
          onClick={() => resendMutation.mutate()}
          disabled={resendMutation.isPending}
          className="font-medium text-primary hover:underline disabled:opacity-50"
        >
          Resend code
        </button>
      </div>

      <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>
    </div>
  );
}
