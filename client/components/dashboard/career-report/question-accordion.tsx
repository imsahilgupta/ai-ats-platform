import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { InterviewQuestion } from "@/types/interview";

export function QuestionAccordion({ title, questions }: { title: string; questions: InterviewQuestion[] }) {
  if (questions.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <Accordion className="rounded-xl border border-border bg-card px-2">
        {questions.map((q, i) => (
          <AccordionItem key={i} value={`${title}-${i}`}>
            <AccordionTrigger className="text-left text-sm">{q.question}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Why this is asked</p>
              <p className="text-sm text-muted-foreground">{q.intention}</p>
              <p className="text-xs font-medium text-muted-foreground">Model answer</p>
              <p className="text-sm text-foreground">{q.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
