"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/auth/field-error";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/types/api";

const schema = z
  .object({
    email: z.email("Enter a valid email address"),
    code: z.string().length(6, "Enter the 6-digit code"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: emailFromQuery, code: "", password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: Values) =>
      resetPassword({ email: values.email, code: values.code, newPassword: values.password }),
    onSuccess: () => setDone(true),
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.body.message : "Failed to reset password.");
    },
  });

  if (done) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="size-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Password updated</h1>
          <p className="text-sm text-muted-foreground">You can now sign in with your new password.</p>
        </div>
        <Button render={<Link href="/login" />} className="w-full" size="lg">
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
        <p className="text-sm text-muted-foreground">Enter the code we emailed you and choose a new password.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
        <div>
          <Label htmlFor="email" className="mb-1.5">
            Email
          </Label>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="code" className="mb-1.5">
            Verification code
          </Label>
          <Input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            aria-invalid={!!errors.code}
            {...register("code")}
          />
          <FieldError message={errors.code?.message} />
        </div>

        <div>
          <Label htmlFor="password" className="mb-1.5">
            New password
          </Label>
          <Input id="password" type="password" autoComplete="new-password" aria-invalid={!!errors.password} {...register("password")} />
          <FieldError message={errors.password?.message} />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="mb-1.5">
            Confirm new password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
          Reset password
        </Button>
      </form>
    </div>
  );
}
