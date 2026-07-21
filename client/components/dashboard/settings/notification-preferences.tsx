"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const PREFERENCES = [
  { key: "interviewReminders", label: "Interview reminders", description: "Nudges to keep up your practice streak" },
  { key: "productUpdates", label: "Product updates", description: "New features and improvements" },
  { key: "weeklyDigest", label: "Weekly progress digest", description: "A summary of your weekly activity" },
];

// Preferences are stored client-side only — no notification-preferences
// endpoint exists on the backend yet.
export function NotificationPreferences() {
  const [values, setValues] = useState<Record<string, boolean>>({
    interviewReminders: true,
    productUpdates: true,
    weeklyDigest: false,
  });

  return (
    <div className="space-y-4">
      {PREFERENCES.map((pref) => (
        <div key={pref.key} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">{pref.label}</p>
            <p className="text-xs text-muted-foreground">{pref.description}</p>
          </div>
          <Switch
            checked={values[pref.key]}
            onCheckedChange={(checked) => setValues((prev) => ({ ...prev, [pref.key]: checked }))}
          />
        </div>
      ))}
    </div>
  );
}
