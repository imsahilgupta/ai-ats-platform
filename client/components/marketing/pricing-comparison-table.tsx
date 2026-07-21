import { Check, Minus } from "lucide-react";

const ROWS: { feature: string; free: boolean | string; pro: boolean | string; enterprise: boolean | string }[] = [
  { feature: "Mock interviews / month", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Resume ATS analyses", free: "Unlimited", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Career strategy reports", free: "Unlimited", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Full analytics & skill tracking", free: false, pro: true, enterprise: true },
  { feature: "Priority AI response times", free: false, pro: true, enterprise: true },
  { feature: "Team progress dashboard", free: false, pro: false, enterprise: true },
  { feature: "Dedicated onboarding", free: false, pro: false, enterprise: true },
  { feature: "Priority support", free: false, pro: false, enterprise: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-foreground">{value}</span>;
  }
  return value ? (
    <Check className="mx-auto size-4 text-success" />
  ) : (
    <Minus className="mx-auto size-4 text-muted-foreground/40" />
  );
}

export function PricingComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Feature</th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">FREE</th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">PRO</th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">ENTERPRISE</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {ROWS.map((row) => (
            <tr key={row.feature}>
              <td className="px-4 py-3 text-foreground">{row.feature}</td>
              <td className="px-4 py-3 text-center">
                <Cell value={row.free} />
              </td>
              <td className="px-4 py-3 text-center">
                <Cell value={row.pro} />
              </td>
              <td className="px-4 py-3 text-center">
                <Cell value={row.enterprise} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
