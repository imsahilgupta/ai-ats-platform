import type { Metadata } from "next";
import { BlogIndexContent } from "@/components/marketing/blog-index-content";
import { NewsletterSignup } from "@/components/marketing/newsletter-signup";

export const metadata: Metadata = { title: "Blog — MockMate.AI" };

export default function BlogIndexPage() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">The MockMate Blog</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Interview tips, resume advice, and career growth strategies from our team.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <BlogIndexContent />
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-20 sm:px-6">
        <NewsletterSignup />
      </section>
    </>
  );
}
