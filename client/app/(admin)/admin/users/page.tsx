"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import { useAdminUsersQuery } from "@/hooks/use-admin-stats";
import type { AdminUser } from "@/types/admin";

const columns: AdminColumn<AdminUser>[] = [
  { key: "username", label: "Username", render: (u) => u.username, csvValue: (u) => u.username },
  { key: "email", label: "Email", render: (u) => u.email, csvValue: (u) => u.email },
  {
    key: "plan",
    label: "Plan",
    render: (u) => (
      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{u.plan}</span>
    ),
    csvValue: (u) => u.plan,
  },
  {
    key: "isAdmin",
    label: "Role",
    render: (u) => (u.isAdmin ? "Admin" : "User"),
    csvValue: (u) => (u.isAdmin ? "admin" : "user"),
  },
  {
    key: "joinedAt",
    label: "Joined",
    render: (u) => new Date(u.joinedAt).toLocaleDateString(),
    csvValue: (u) => u.joinedAt,
  },
];

export default function AdminUsersPage() {
  const { data, isLoading } = useAdminUsersQuery();

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <PageHeader title="Users" description="Manage platform users and their plans." />
      {isLoading || !data ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <AdminDataTable
          columns={columns}
          rows={data.users}
          searchPlaceholder="Search by username or email..."
          filterFn={(row, q) => row.username.toLowerCase().includes(q) || row.email.toLowerCase().includes(q)}
          exportFileName="users.csv"
          isDemoData={false}
        />
      )}
    </div>
  );
}
