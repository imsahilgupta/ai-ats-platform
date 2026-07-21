"use client";

import { useState } from "react";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateMockAnnouncements, type MockAnnouncement } from "@/lib/mock/admin";

const AUDIENCE_LABEL: Record<MockAnnouncement["audience"], string> = {
  all: "All users",
  free: "FREE plan",
  pro: "PRO plan",
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(generateMockAnnouncements());
  const [form, setForm] = useState<{ title: string; body: string; audience: MockAnnouncement["audience"] }>({
    title: "",
    body: "",
    audience: "all",
  });

  const create = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setAnnouncements((prev) => [
      { id: crypto.randomUUID(), ...form, publishedAt: new Date().toISOString() },
      ...prev,
    ]);
    setForm({ title: "", body: "", audience: "all" });
  };

  const remove = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Announcements" description="Publish updates to your users." action={<DemoDataBadge />} />

      <div className="space-y-3 rounded-xl border border-dashed border-border p-4">
        <Input
          placeholder="Announcement title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <Textarea
          placeholder="Announcement body"
          className="min-h-20"
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
        />
        <div className="flex items-center gap-2">
          <Select value={form.audience} onValueChange={(v) => v && setForm((f) => ({ ...f, audience: v as MockAnnouncement["audience"] }))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              <SelectItem value="free">FREE plan</SelectItem>
              <SelectItem value="pro">PRO plan</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={create}>
            <Plus className="size-3.5" />
            Publish
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Megaphone className="size-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    {AUDIENCE_LABEL[a.audience]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(a.publishedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <button onClick={() => remove(a.id)} aria-label="Delete announcement">
              <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
