import type { Metadata } from "next";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { PricingComparisonTable } from "@/components/marketing/pricing-comparison-table";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { CtaSection } from "@/components/marketing/cta-section";
import { FAQS } from "@/lib/data/marketing";

export const metadata: Metadata = { title: "Pricing — MockMate.AI" };

export default function PricingPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Plans that grow with your job search
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Start free. Upgrade to PRO whenever you want unlimited mock interview practice.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <PricingCards />
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">Compare plans</h2>
        <PricingComparisonTable />
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">Pricing FAQ</h2>
        <FaqAccordion faqs={FAQS} />
      </section>

      <CtaSection />
    </>
  );
}
