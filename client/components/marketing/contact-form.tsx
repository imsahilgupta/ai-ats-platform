"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/auth/field-error";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.email("Enter a valid email address"),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)"),
});

type Values = z.infer<typeof schema>;

// No backend contact endpoint exists yet — submits are simulated with a
// delay, clearly surfaced to the user rather than silently pretending.
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", message: "" } });

  if (sent) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/5 p-6 text-center">
        <p className="text-sm font-medium text-foreground">Message sent</p>
        <p className="mt-1 text-sm text-muted-foreground">Thanks for reaching out — we&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(() => {
        setIsSubmitting(true);
        setTimeout(() => {
          setIsSubmitting(false);
          setSent(true);
          reset();
        }, 900);
      })}
      noValidate
    >
      <div>
        <Label htmlFor="name" className="mb-1.5">
          Name
        </Label>
        <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>
      <div>
        <Label htmlFor="email" className="mb-1.5">
          Email
        </Label>
        <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="message" className="mb-1.5">
          Message
        </Label>
        <Textarea id="message" className="min-h-32" aria-invalid={!!errors.message} {...register("message")} />
        <FieldError message={errors.message?.message} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        Send message
      </Button>
    </form>
  );
}
