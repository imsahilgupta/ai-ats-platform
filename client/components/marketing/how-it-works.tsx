import { HOW_IT_WORKS_STEPS } from "@/lib/data/marketing";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card/50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">How MockMate works</h2>
          <p className="mt-3 text-muted-foreground">From upload to offer, in four steps.</p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={step.step} className="relative">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {step.step}
              </div>
              {i < HOW_IT_WORKS_STEPS.length - 1 && (
                <span className="absolute top-5 left-10 hidden h-px w-[calc(100%-1rem)] bg-border sm:block" />
              )}
              <h3 className="mt-4 text-sm font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
