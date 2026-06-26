"use client";

import { useState } from "react";
import { useBulkUploads } from "@/lib/queries/useModules";
import { QueryError, QueryLoading } from "@/components/seller/ui/QueryState";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import { Button } from "@/components/seller/ui/Button";
import { formatDate, formatRelative } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/helpers";
import { Upload, FileSpreadsheet, Download } from "lucide-react";

export default function BulkUploadPage() {
  const [tab, setTab] = useState<"upload" | "history">("upload");
  const { data, isLoading, isError, refetch } = useBulkUploads();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">Bulk Upload</h1>

      <div className="flex gap-1 rounded-[8px] border border-border bg-card p-1">
        {(["upload", "history"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-[6px] px-3 py-2 text-sm font-medium capitalize",
              tab === t ? "bg-primary text-white" : "text-text-secondary hover:bg-surface",
            )}
          >
            {t === "upload" ? "Upload file" : "Upload history"}
          </button>
        ))}
      </div>

      {tab === "upload" && (
        <div className="space-y-4">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" /> Download CSV template
          </Button>
          <div
            className="flex flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-border bg-surface py-16 text-center"
          >
            <Upload className="h-10 w-10 text-text-muted" />
            <p className="mt-3 font-medium">Drag CSV or XLSX here</p>
            <p className="mt-1 text-sm text-text-secondary">Max 500 rows per file</p>
            <Button className="mt-4" variant="secondary" size="sm">Browse files</Button>
          </div>
          <p className="text-xs text-text-muted">Upload is stubbed — file parsing will connect to Supabase later.</p>
        </div>
      )}

      {tab === "history" && (
        <div className="rounded-[8px] border border-border bg-card">
          {isLoading && <QueryLoading />}
          {isError && <QueryError onRetry={() => refetch()} />}
          {data && (
            <ul className="divide-y divide-border">
              {data.map((row) => (
                <li key={row.id} className="flex flex-wrap items-center gap-4 px-4 py-4">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{row.file_name}</p>
                    <p className="text-xs text-text-muted">{formatDate(row.uploaded_at)} · {formatRelative(row.uploaded_at)}</p>
                  </div>
                  <div className="text-sm text-text-secondary">
                    <span className="text-success font-medium">{row.successful}</span> ok
                    {row.failed > 0 && <span className="text-destructive"> · {row.failed} failed</span>}
                    <span> / {row.total_rows} rows</span>
                  </div>
                  <StatusBadge status={row.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
