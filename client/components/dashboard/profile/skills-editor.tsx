"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateProfileDetailsMutation } from "@/hooks/use-profile-details";

export function SkillsEditor({ skills }: { skills: string[] }) {
  const [value, setValue] = useState("");
  const mutation = useUpdateProfileDetailsMutation();

  const addSkill = () => {
    const trimmed = value.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    mutation.mutate({ skills: [...skills, trimmed] });
    setValue("");
  };

  const removeSkill = (skill: string) => {
    mutation.mutate({ skills: skills.filter((s) => s !== skill) });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-foreground"
          >
            {skill}
            <button onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
              <X className="size-3 text-muted-foreground hover:text-foreground" />
            </button>
          </span>
        ))}
        {skills.length === 0 && <p className="text-sm text-muted-foreground">No skills added yet.</p>}
      </div>
      <div className="mt-3 flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="e.g. TypeScript"
          className="h-8"
        />
        <Button type="button" size="sm" variant="outline" onClick={addSkill}>
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>
    </div>
  );
}
