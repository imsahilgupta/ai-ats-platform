"use client";

import { CircleDot, Database } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDatabaseQuery, useAdminSystemQuery } from "@/hooks/use-admin-stats";

export default function AdminDatabasePage() {
  const { data, isLoading } = useAdminDatabaseQuery();
  const { data: system } = useAdminSystemQuery();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Database" description="MongoDB collection overview." />

      {isLoading || !data ? (
        <Skeleton className="h-16 rounded-xl" />
      ) : (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 ${
            data.status === "connected" ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
          }`}
        >
          <span
            className={`flex size-9 items-center justify-center rounded-full ${
              data.status === "connected" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            }`}
          >
            <CircleDot className={`size-4 ${data.status === "connected" ? "fill-success" : "fill-destructive"}`} />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              {data.status === "connected" ? "Connection healthy" : "Connection unavailable"}
            </p>
            <p className="text-xs text-muted-foreground">
              MongoDB{system?.dbLatencyMs != null ? ` · ping ${system.dbLatencyMs}ms` : ""}
            </p>
          </div>
        </div>
      )}

      {isLoading || !data ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Collection</th>
                <th className="px-4 py-2.5 text-left font-medium">Documents</th>
                <th className="px-4 py-2.5 text-left font-medium">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.collections.map((c) => (
                <tr key={c.name}>
                  <td className="flex items-center gap-2 px-4 py-2.5 font-mono text-xs text-foreground">
                    <Database className="size-3.5 text-muted-foreground" />
                    {c.name}
                  </td>
                  <td className="px-4 py-2.5 tabular-nums text-foreground">{c.documents.toLocaleString()}</td>
                  <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{c.sizeMb.toFixed(2)} MB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
