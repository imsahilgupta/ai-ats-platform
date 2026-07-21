import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { FAQS } from "@/lib/data/marketing";

export function FaqSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Frequently asked questions
        </h2>
      </div>
      <div className="mt-12">
        <FaqAccordion faqs={FAQS} />
      </div>
    </section>
  );
}
