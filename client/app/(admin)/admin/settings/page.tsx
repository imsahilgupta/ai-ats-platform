"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TOGGLES = [
  { key: "maintenanceMode", label: "Maintenance mode", description: "Show a maintenance banner to all users" },
  { key: "newRegistrations", label: "Allow new registrations", description: "Let new users sign up" },
  { key: "oauthLogin", label: "OAuth login", description: "Enable Google sign-in" },
];

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("MockMate.AI");
  const [supportEmail, setSupportEmail] = useState("support@mockmate.ai");
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    maintenanceMode: false,
    newRegistrations: true,
    oauthLogin: true,
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Platform Settings" description="Global configuration for the platform." action={<DemoDataBadge />} />

      <form
        className="space-y-4 rounded-xl border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Settings saved (preview only — not persisted server-side)");
        }}
      >
        <div>
          <Label htmlFor="siteName" className="mb-1.5">
            Site name
          </Label>
          <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="supportEmail" className="mb-1.5">
            Support email
          </Label>
          <Input id="supportEmail" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
        </div>
        <Button type="submit" size="sm">
          <Save className="size-3.5" />
          Save changes
        </Button>
      </form>

      <div className="space-y-3">
        {TOGGLES.map((toggle) => (
          <div key={toggle.key} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">{toggle.label}</p>
              <p className="text-xs text-muted-foreground">{toggle.description}</p>
            </div>
            <Switch
              checked={toggles[toggle.key]}
              onCheckedChange={(checked) => setToggles((prev) => ({ ...prev, [toggle.key]: checked }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
