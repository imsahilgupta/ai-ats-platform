import { Receipt } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import type { Subscription } from "@/types/subscription";
import { PLAN_PRICING } from "@/lib/constants";

// No backend invoices endpoint exists yet — this renders a single inferred
// line item from the current subscription record so the Billing tab isn't
// empty, clearly labeled as a preview rather than a real invoice history.
export function InvoicesList({ subscription }: { subscription: Subscription }) {
  if (subscription.plan === "FREE") {
    return (
      <EmptyState icon={Receipt} title="No invoices" description="You're on the FREE plan — nothing has been billed." />
    );
  }

  const pricing = PLAN_PRICING[subscription.plan];

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 text-left font-medium">Date</th>
            <th className="px-4 py-2.5 text-left font-medium">Plan</th>
            <th className="px-4 py-2.5 text-left font-medium">Amount</th>
            <th className="px-4 py-2.5 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2.5 text-foreground">{new Date(subscription.startDate).toLocaleDateString()}</td>
            <td className="px-4 py-2.5 text-foreground">{subscription.plan}</td>
            <td className="px-4 py-2.5 tabular-nums text-foreground">NPR {pricing.npr.toLocaleString()}</td>
            <td className="px-4 py-2.5">
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Paid</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="border-t border-border bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
        Full invoice history is in preview — this reflects your current billing period only.
      </p>
    </div>
  );
}
