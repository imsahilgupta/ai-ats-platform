"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/auth/field-error";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { register as registerUser } from "@/lib/api/auth";
import { ApiError } from "@/types/api";

// Mirrors Backend/src/utils/validation.js exactly (validatePasswordStrength,
// validateUsername) so client-side errors match what the server would reject.
const registerSchema = z
  .object({
    username: z
      .string()
      .regex(/^[a-zA-Z0-9_-]{3,20}$/, "3-20 characters: letters, numbers, underscore, hyphen only"),
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/[0-9]/, "Include a number")
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Include a special character (!@#$%^&* etc.)"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v, "You must accept the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });
  const acceptTerms = useWatch({ control, name: "acceptTerms" });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success("Check your email for a verification code");
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.body.message);
      } else {
        toast.error("Unable to create your account. Please try again.");
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">Start preparing smarter, in minutes.</p>
      </div>

      <OAuthButtons />

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or continue with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form
        className="space-y-4"
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <div>
          <Label htmlFor="username" className="mb-1.5">
            Username
          </Label>
          <Input id="username" autoComplete="username" aria-invalid={!!errors.username} {...register("username")} />
          <FieldError message={errors.username?.message} />
        </div>

        <div>
          <Label htmlFor="email" className="mb-1.5">
            Email
          </Label>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="password" className="mb-1.5">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className="pr-9"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="mb-1.5">
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        <div>
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={acceptTerms}
              onCheckedChange={(checked) => setValue("acceptTerms", !!checked, { shouldValidate: true })}
              className="mt-0.5"
            />
            <span>
              I agree to the{" "}
              <Link href="/legal/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          <FieldError message={errors.acceptTerms?.message} />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
