"use client";

import { useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// No change-password endpoint exists on the backend yet — this form is a
// clearly-labeled preview, not wired to a real mutation.
export function SecuritySettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground/80">
        <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
        Password change is in preview — this form isn&apos;t connected to a live endpoint yet.
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setIsSubmitting(true);
          setTimeout(() => setIsSubmitting(false), 800);
        }}
      >
        <div>
          <Label htmlFor="currentPassword" className="mb-2">
            Current password
          </Label>
          <Input id="currentPassword" type="password" autoComplete="current-password" />
        </div>
        <div>
          <Label htmlFor="newPassword" className="mb-2">
            New password
          </Label>
          <Input id="newPassword" type="password" autoComplete="new-password" />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Update password
        </Button>
      </form>
    </div>
  );
}
