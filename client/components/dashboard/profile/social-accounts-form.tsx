"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpdateProfileDetailsMutation } from "@/hooks/use-profile-details";
import type { SocialAccounts } from "@/types/profile";

export function SocialAccountsForm({ social }: { social: SocialAccounts }) {
  const mutation = useUpdateProfileDetailsMutation();
  const [form, setForm] = useState(social);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({ social: form });
      }}
    >
      <div>
        <Label htmlFor="github" className="mb-1.5">
          GitHub
        </Label>
        <Input
          id="github"
          placeholder="https://github.com/username"
          value={form.github}
          onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="linkedin" className="mb-1.5">
          LinkedIn
        </Label>
        <Input
          id="linkedin"
          placeholder="https://linkedin.com/in/username"
          value={form.linkedin}
          onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="portfolio" className="mb-1.5">
          Portfolio
        </Label>
        <Input
          id="portfolio"
          placeholder="https://yourportfolio.com"
          value={form.portfolio}
          onChange={(e) => setForm((f) => ({ ...f, portfolio: e.target.value }))}
        />
      </div>
      <Button type="submit" size="sm" disabled={mutation.isPending}>
        <Save className="size-3.5" />
        Save social accounts
      </Button>
    </form>
  );
}
