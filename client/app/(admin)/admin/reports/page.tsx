"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import { useAdminReportsQuery } from "@/hooks/use-admin-stats";
import type { AdminReportEntry, AdminReportType } from "@/types/admin";

const TYPE_LABEL: Record<AdminReportType, string> = {
  career: "Career Report",
  resume: "Resume Analysis",
  "mock-interview": "Mock Interview",
};

const columns: AdminColumn<AdminReportEntry>[] = [
  { key: "type", label: "Type", render: (r) => TYPE_LABEL[r.type], csvValue: (r) => r.type },
  { key: "user", label: "User", render: (r) => r.user, csvValue: (r) => r.user },
  { key: "score", label: "Score", render: (r) => r.score, csvValue: (r) => r.score },
  {
    key: "createdAt",
    label: "Created",
    render: (r) => new Date(r.createdAt).toLocaleDateString(),
    csvValue: (r) => r.createdAt,
  },
];

export default function AdminReportsPage() {
  const { data, isLoading } = useAdminReportsQuery();

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <PageHeader
        title="Reports"
        description="All career reports, resume analyses, and mock interviews across the platform."
      />
      {isLoading || !data ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <AdminDataTable
          columns={columns}
          rows={data.reports}
          searchPlaceholder="Search by user..."
          filterFn={(row, q) => row.user.toLowerCase().includes(q)}
          exportFileName="reports.csv"
          isDemoData={false}
        />
      )}
    </div>
  );
}
