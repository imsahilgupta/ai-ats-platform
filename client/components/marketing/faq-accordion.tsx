import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FaqAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <Accordion className="mx-auto max-w-2xl rounded-xl border border-border bg-card px-4">
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger className="text-left text-sm">{faq.question}</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
