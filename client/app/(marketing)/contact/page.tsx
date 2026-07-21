import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { FAQS } from "@/lib/data/marketing";

export const metadata: Metadata = { title: "Contact — MockMate.AI" };

const CONTACT_DETAILS = [
  { icon: Mail, label: "Email", value: "support@mockmate.ai" },
  { icon: Phone, label: "Phone", value: "+1 (555) 010-0198" },
  { icon: MapPin, label: "Address", value: "548 Market St, San Francisco, CA 94104" },
];

export default function ContactPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Get in touch</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Questions about MockMate.AI? Our team typically responds within one business day.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <ContactForm />
          </div>

          <div className="space-y-6">
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              {CONTACT_DETAILS.map((detail) => (
                <div key={detail.label} className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <detail.icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">{detail.label}</p>
                    <p className="text-sm font-medium text-foreground">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              aria-hidden
              className="relative flex h-48 items-center justify-center overflow-hidden rounded-xl border border-border bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] bg-card"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <MapPin className="size-5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">Common questions</h2>
        <FaqAccordion faqs={FAQS} />
      </section>
    </>
  );
}
