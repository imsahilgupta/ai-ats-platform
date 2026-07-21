"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, RotateCcw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Keyed by round number from the parent so a fresh mount naturally resets
// both the answer text and the elapsed-time stopwatch each round, without
// needing an effect that resets state synchronously (which React flags).
export function AnswerComposer({
  onSubmit,
  isSubmitting,
  isRetryable,
}: {
  onSubmit: (answer: string, durationSeconds: number) => void;
  isSubmitting: boolean;
  isRetryable: boolean;
}) {
  const [value, setValue] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      {isRetryable && (
        <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground/80">
          <AlertCircle className="size-3.5 shrink-0" />
          Your answer was saved, but the AI is briefly busy generating the next question. Try again.
        </div>
      )}
      <Textarea
        placeholder="Type your answer..."
        className="min-h-32"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isSubmitting}
      />
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{formatElapsed(elapsedSeconds)}</span>
        <Button onClick={() => onSubmit(value, elapsedSeconds)} disabled={!value.trim() || isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isRetryable ? (
            <RotateCcw className="size-4" />
          ) : (
            <Send className="size-4" />
          )}
          {isRetryable ? "Retry" : "Submit answer"}
        </Button>
      </div>
    </div>
  );
}
