"use client";

import { useState } from "react";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateProfileDetailsMutation } from "@/hooks/use-profile-details";
import type { EducationEntry } from "@/types/profile";

export function EducationList({ education }: { education: EducationEntry[] }) {
  const mutation = useUpdateProfileDetailsMutation();
  const [form, setForm] = useState({ school: "", degree: "", year: "" });

  const add = () => {
    if (!form.school.trim()) return;
    mutation.mutate({ education: [...education, { id: crypto.randomUUID(), ...form }] });
    setForm({ school: "", degree: "", year: "" });
  };

  const remove = (id: string) => {
    mutation.mutate({ education: education.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-3">
      {education.map((entry) => (
        <div key={entry.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
          <div className="flex items-start gap-2.5">
            <GraduationCap className="mt-0.5 size-4 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{entry.school}</p>
              <p className="text-xs text-muted-foreground">
                {entry.degree} {entry.year && `· ${entry.year}`}
              </p>
            </div>
          </div>
          <button onClick={() => remove(entry.id)} aria-label="Remove education entry">
            <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      ))}

      <div className="grid gap-2 rounded-lg border border-dashed border-border p-3 sm:grid-cols-3">
        <Input
          placeholder="School"
          value={form.school}
          onChange={(e) => setForm((f) => ({ ...f, school: e.target.value }))}
        />
        <Input
          placeholder="Degree"
          value={form.degree}
          onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))}
        />
        <Input
          placeholder="Year"
          value={form.year}
          onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
        />
      </div>
      <Button type="button" size="sm" variant="outline" onClick={add}>
        <Plus className="size-3.5" />
        Add education
      </Button>
    </div>
  );
}
