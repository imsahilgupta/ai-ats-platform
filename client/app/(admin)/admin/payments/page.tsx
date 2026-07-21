"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import { generateMockPayments, type MockPayment } from "@/lib/mock/admin";

const payments = generateMockPayments();

const STATUS_CLASS: Record<MockPayment["status"], string> = {
  paid: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  refunded: "bg-warning/10 text-warning-foreground/80 dark:text-warning",
};

const columns: AdminColumn<MockPayment>[] = [
  { key: "user", label: "User", render: (p) => p.user, csvValue: (p) => p.user },
  { key: "plan", label: "Plan", render: (p) => p.plan, csvValue: (p) => p.plan },
  { key: "amount", label: "Amount", render: (p) => `NPR ${p.amount.toLocaleString()}`, csvValue: (p) => p.amount },
  { key: "gateway", label: "Gateway", render: (p) => p.gateway, csvValue: (p) => p.gateway },
  {
    key: "status",
    label: "Status",
    render: (p) => (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[p.status]}`}>{p.status}</span>
    ),
    csvValue: (p) => p.status,
  },
  { key: "date", label: "Date", render: (p) => new Date(p.date).toLocaleDateString(), csvValue: (p) => p.date },
];

export default function AdminPaymentsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <PageHeader
        title="Payments"
        description="Stripe and eSewa transaction history across all users."
        action={<DemoDataBadge />}
      />
      <AdminDataTable
        columns={columns}
        rows={payments}
        searchPlaceholder="Search by user..."
        filterFn={(row, q) => row.user.toLowerCase().includes(q)}
        exportFileName="payments.csv"
      />
    </div>
  );
}
