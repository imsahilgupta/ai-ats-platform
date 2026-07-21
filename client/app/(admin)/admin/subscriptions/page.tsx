"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import { useAdminSubscriptionsQuery } from "@/hooks/use-admin-stats";
import type { AdminSubscriptionEntry } from "@/types/admin";

const columns: AdminColumn<AdminSubscriptionEntry>[] = [
  { key: "username", label: "User", render: (s) => s.username, csvValue: (s) => s.username },
  { key: "email", label: "Email", render: (s) => s.email, csvValue: (s) => s.email },
  {
    key: "plan",
    label: "Plan",
    render: (s) => (
      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{s.plan}</span>
    ),
    csvValue: (s) => s.plan,
  },
  {
    key: "isActive",
    label: "Status",
    render: (s) =>
      s.isActive ? (
        <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Active</span>
      ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Expired</span>
      ),
    csvValue: (s) => (s.isActive ? "active" : "expired"),
  },
  {
    key: "startDate",
    label: "Subscribed since",
    render: (s) => new Date(s.startDate).toLocaleDateString(),
    csvValue: (s) => s.startDate,
  },
];

export default function AdminSubscriptionsPage() {
  const { data, isLoading } = useAdminSubscriptionsQuery();

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <PageHeader title="Subscriptions" description="Active PRO and ENTERPRISE subscriptions." />
      {isLoading || !data ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <AdminDataTable
          columns={columns}
          rows={data.subscriptions}
          searchPlaceholder="Search by username or email..."
          filterFn={(row, q) => row.username.toLowerCase().includes(q) || row.email.toLowerCase().includes(q)}
          exportFileName="subscriptions.csv"
          isDemoData={false}
        />
      )}
    </div>
  );
}
