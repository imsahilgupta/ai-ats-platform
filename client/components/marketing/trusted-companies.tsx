import { TRUSTED_COMPANIES } from "@/lib/data/marketing";

export function TrustedCompanies() {
  return (
    <section className="border-y border-border bg-card/50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Candidates who prepared with MockMate.AI now work at
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {TRUSTED_COMPANIES.map((name) => (
            <span key={name} className="text-lg font-semibold text-muted-foreground/60 select-none">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
