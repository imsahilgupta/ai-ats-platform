"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export interface AdminColumn<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  csvValue?: (row: T) => string | number;
}

function toCsv<T>(columns: AdminColumn<T>[], rows: T[]) {
  const header = columns.map((c) => `"${c.label}"`).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const value = c.csvValue ? c.csvValue(row) : "";
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(","),
    )
    .join("\n");
  return `${header}\n${body}`;
}

export function AdminDataTable<T>({
  columns,
  rows,
  searchPlaceholder = "Search...",
  filterFn,
  exportFileName = "export.csv",
  isDemoData = true,
}: {
  columns: AdminColumn<T>[];
  rows: T[];
  searchPlaceholder?: string;
  filterFn: (row: T, query: string) => boolean;
  exportFileName?: string;
  isDemoData?: boolean;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    return rows.filter((row) => filterFn(row, query.toLowerCase()));
  }, [rows, query, filterFn]);

  const handleExport = () => {
    const csv = toCsv(columns, filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={filtered.length === 0}>
          <Download className="size-3.5" />
          Export CSV
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="No results" description="Try a different search term." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-2.5 text-left font-medium whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2.5 whitespace-nowrap text-foreground">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {rows.length}
        {isDemoData ? " — demo data" : ""}
      </p>
    </div>
  );
}
