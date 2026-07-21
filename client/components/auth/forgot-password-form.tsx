"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/auth/field-error";
import { forgotPassword } from "@/lib/api/auth";

const schema = z.object({ email: z.email("Enter a valid email address") });
type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (_, email) => setSentTo(email),
  });

  if (sentTo) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
          <MailCheck className="size-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{sentTo}</span>, we&apos;ve
            sent a 6-digit code to reset your password.
          </p>
        </div>
        <Button render={<Link href={`/reset-password?email=${encodeURIComponent(sentTo)}`} />} className="w-full" size="lg">
          Enter code
        </Button>
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a 6-digit code to reset it.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={handleSubmit((values) => mutation.mutate(values.email))}
        noValidate
      >
        <div>
          <Label htmlFor="email" className="mb-1.5">
            Email
          </Label>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
          Send reset code
        </Button>
      </form>

      <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>
    </div>
  );
}
