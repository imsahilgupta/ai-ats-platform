"use client";

import { useState } from "react";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUpdateProfileDetailsMutation } from "@/hooks/use-profile-details";
import type { ExperienceEntry } from "@/types/profile";

export function ExperienceList({ experience }: { experience: ExperienceEntry[] }) {
  const mutation = useUpdateProfileDetailsMutation();
  const [form, setForm] = useState({ company: "", title: "", duration: "", description: "" });

  const add = () => {
    if (!form.company.trim() || !form.title.trim()) return;
    mutation.mutate({ experience: [...experience, { id: crypto.randomUUID(), ...form }] });
    setForm({ company: "", title: "", duration: "", description: "" });
  };

  const remove = (id: string) => {
    mutation.mutate({ experience: experience.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-3">
      {experience.map((entry) => (
        <div key={entry.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
          <div className="flex items-start gap-2.5">
            <Briefcase className="mt-0.5 size-4 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {entry.title} &middot; {entry.company}
              </p>
              {entry.duration && <p className="text-xs text-muted-foreground">{entry.duration}</p>}
              {entry.description && <p className="mt-1 text-xs text-muted-foreground">{entry.description}</p>}
            </div>
          </div>
          <button onClick={() => remove(entry.id)} aria-label="Remove experience entry">
            <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      ))}

      <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
        <div className="grid gap-2 sm:grid-cols-3">
          <Input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          />
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Input
            placeholder="Duration (e.g. 2023–Present)"
            value={form.duration}
            onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
          />
        </div>
        <Textarea
          placeholder="Brief description (optional)"
          className="min-h-16"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>
      <Button type="button" size="sm" variant="outline" onClick={add}>
        <Plus className="size-3.5" />
        Add experience
      </Button>
    </div>
  );
}
