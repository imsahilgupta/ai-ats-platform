import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPostSummary } from "@/types/blog";

export function BlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
    >
      <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
        {post.category}
      </span>
      <h3 className="mt-3 text-base font-semibold text-foreground">{post.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {new Date(post.publishedAt).toLocaleDateString()} &middot; {post.readTime}
        </span>
        <span className="flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Read <ArrowRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}
