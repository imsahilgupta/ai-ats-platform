"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// No backend newsletter endpoint exists yet — simulated with a delay.
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Mail className="size-5" />
      </span>
      <p className="mt-3 text-lg font-semibold text-foreground">Get interview tips in your inbox</p>
      <p className="mt-1 text-sm text-muted-foreground">One email a week. No spam, unsubscribe anytime.</p>

      {status === "done" ? (
        <p className="mt-4 text-sm font-medium text-success">You&apos;re subscribed! Check your inbox.</p>
      ) : (
        <form
          className="mx-auto mt-4 flex max-w-sm gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setStatus("submitting");
            setTimeout(() => setStatus("done"), 800);
          }}
        >
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" && <Loader2 className="size-4 animate-spin" />}
            Subscribe
          </Button>
        </form>
      )}
    </div>
  );
}
