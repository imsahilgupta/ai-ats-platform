"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, LifeBuoy, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { HELP_CATEGORIES } from "@/lib/data/marketing";

export function HelpCenterContent() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return HELP_CATEGORIES;
    const q = query.toLowerCase();
    return HELP_CATEGORIES.map((category) => ({
      ...category,
      articles: category.articles.filter((a) => a.toLowerCase().includes(q)),
    })).filter((category) => category.articles.length > 0);
  }, [query]);

  return (
    <div>
      <div className="relative mx-auto max-w-lg">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help articles..."
          className="h-10 pl-9"
        />
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {filtered.map((category) => (
          <div key={category.title} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">{category.title}</p>
            </div>
            <ul className="space-y-2">
              {category.articles.map((article) => (
                <li key={article}>
                  <button className="text-left text-sm text-muted-foreground hover:text-foreground hover:underline">
                    {article}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10">
          <EmptyState icon={Search} title="No articles found" description="Try a different search term." />
        </div>
      )}

      <div className="mt-12 flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-8 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LifeBuoy className="size-5" />
        </span>
        <p className="text-sm font-medium text-foreground">Still need help?</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Our support team is happy to help with anything not covered here.
        </p>
        <Button render={<Link href="/contact" />}>Contact support</Button>
      </div>
    </div>
  );
}
