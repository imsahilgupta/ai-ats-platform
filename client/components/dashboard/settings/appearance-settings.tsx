"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-3">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border px-4 py-5 text-sm transition-colors",
            theme === option.value
              ? "border-primary bg-primary/5 text-foreground"
              : "border-border text-muted-foreground hover:border-primary/40",
          )}
        >
          <option.icon className="size-5" />
          {option.label}
        </button>
      ))}
    </div>
  );
}
