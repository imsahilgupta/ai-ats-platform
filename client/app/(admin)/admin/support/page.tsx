"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import { generateMockSupportTickets, type MockSupportTicket } from "@/lib/mock/admin";

const tickets = generateMockSupportTickets();

const PRIORITY_CLASS: Record<MockSupportTicket["priority"], string> = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning-foreground/80 dark:text-warning",
  high: "bg-destructive/10 text-destructive",
};

const STATUS_CLASS: Record<MockSupportTicket["status"], string> = {
  open: "bg-primary/10 text-primary",
  pending: "bg-warning/10 text-warning-foreground/80 dark:text-warning",
  resolved: "bg-success/10 text-success",
};

const columns: AdminColumn<MockSupportTicket>[] = [
  { key: "subject", label: "Subject", render: (t) => t.subject, csvValue: (t) => t.subject },
  { key: "user", label: "User", render: (t) => t.user, csvValue: (t) => t.user },
  {
    key: "priority",
    label: "Priority",
    render: (t) => (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_CLASS[t.priority]}`}>{t.priority}</span>
    ),
    csvValue: (t) => t.priority,
  },
  {
    key: "status",
    label: "Status",
    render: (t) => (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[t.status]}`}>{t.status}</span>
    ),
    csvValue: (t) => t.status,
  },
  {
    key: "createdAt",
    label: "Created",
    render: (t) => new Date(t.createdAt).toLocaleDateString(),
    csvValue: (t) => t.createdAt,
  },
];

export default function AdminSupportPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <PageHeader title="Support Tickets" description="Customer support requests." action={<DemoDataBadge />} />
      <AdminDataTable
        columns={columns}
        rows={tickets}
        searchPlaceholder="Search by subject or user..."
        filterFn={(row, q) => row.subject.toLowerCase().includes(q) || row.user.toLowerCase().includes(q)}
        exportFileName="support-tickets.csv"
      />
    </div>
  );
}
