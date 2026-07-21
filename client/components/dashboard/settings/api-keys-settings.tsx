"use client";

import { useState } from "react";
import { Copy, KeyRound, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function generateMockKey() {
  return `mm_${Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
}

// No API key management endpoint exists on the backend yet — this generates
// a client-side placeholder key purely for preview purposes.
export function ApiKeysSettings() {
  const [apiKey, setApiKey] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground/80">
        <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
        API access is in preview — keys generated here are not yet functional.
      </div>

      {apiKey ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <code className="truncate font-mono text-sm text-foreground">{apiKey}</code>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(apiKey);
              toast.success("Copied to clipboard");
            }}
          >
            <Copy className="size-4" />
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setApiKey(generateMockKey())}>
          <KeyRound className="size-4" />
          Generate API key
        </Button>
      )}
    </div>
  );
}
