"use client";

import { Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import { generateMockFeedback, type MockFeedback } from "@/lib/mock/admin";

const feedback = generateMockFeedback();

const columns: AdminColumn<MockFeedback>[] = [
  { key: "user", label: "User", render: (f) => f.user, csvValue: (f) => f.user },
  { key: "message", label: "Message", render: (f) => <span className="whitespace-normal">{f.message}</span>, csvValue: (f) => f.message },
  {
    key: "rating",
    label: "Rating",
    render: (f) => (
      <span className="flex items-center gap-0.5 text-gamification">
        {Array.from({ length: f.rating }).map((_, i) => (
          <Star key={i} className="size-3.5 fill-current" />
        ))}
      </span>
    ),
    csvValue: (f) => f.rating,
  },
  {
    key: "createdAt",
    label: "Date",
    render: (f) => new Date(f.createdAt).toLocaleDateString(),
    csvValue: (f) => f.createdAt,
  },
];

export default function AdminFeedbackPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <PageHeader title="Feedback" description="User feedback and ratings." action={<DemoDataBadge />} />
      <AdminDataTable
        columns={columns}
        rows={feedback}
        searchPlaceholder="Search feedback..."
        filterFn={(row, q) => row.message.toLowerCase().includes(q) || row.user.toLowerCase().includes(q)}
        exportFileName="feedback.csv"
      />
    </div>
  );
}
