import type { Metadata } from "next";
import { HelpCenterContent } from "@/components/marketing/help-center-content";

export const metadata: Metadata = { title: "Help Center — MockMate.AI" };

export default function HelpCenterPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">How can we help?</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Documentation, tutorials, and troubleshooting guides for getting the most out of MockMate.AI.
        </p>
      </div>

      <div className="mt-10">
        <HelpCenterContent />
      </div>
    </section>
  );
}
