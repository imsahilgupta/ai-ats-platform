import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { MarkdownReport } from "@/components/shared/markdown-report";
import { RoleAvatar } from "@/components/shared/role-avatar";
import { NewsletterSignup } from "@/components/marketing/newsletter-signup";
import { BLOG_POSTS } from "@/lib/data/marketing";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  return { title: post ? `${post.title} — MockMate.AI Blog` : "Blog — MockMate.AI" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link href="/blog" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>

      <span className="mt-6 inline-block w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
        {post.category}
      </span>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{post.title}</h1>

      <div className="mt-4 flex items-center gap-3">
        <RoleAvatar name="MockMate Team" />
        <div className="text-sm">
          <p className="font-medium text-foreground">MockMate Team</p>
          <p className="text-muted-foreground">
            {new Date(post.date).toLocaleDateString()} &middot; {post.readTime}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <MarkdownReport content={post.content} />
      </div>

      <div className="mt-12">
        <NewsletterSignup />
      </div>
    </article>
  );
}
