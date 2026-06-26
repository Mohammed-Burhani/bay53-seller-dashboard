"use client";

import Link from "next/link";
import { useRfqs } from "@/lib/queries/useModules";
import { useTableFilters } from "@/lib/hooks/useTableFilters";
import { QueryError, QueryLoading } from "@/components/seller/ui/QueryState";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import { formatCurrency, formatRelative } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/helpers";
import { Briefcase, Clock } from "lucide-react";
import { EmptyState } from "@/components/seller/ui/EmptyState";

const DEFAULTS = { status: "" };

function hoursUntil(deadline: string) {
  return (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60);
}

export default function B2bPage() {
  const { filters, setFilter } = useTableFilters(DEFAULTS);
  const { data, isLoading, isError, refetch } = useRfqs(filters);

  const sorted = data?.data
    ? [...data.data].sort((a, b) => new Date(a.response_deadline).getTime() - new Date(b.response_deadline).getTime())
    : [];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">B2B / RFQ</h1>

      <div className="flex flex-wrap gap-2">
        {["", "new", "quoted", "negotiating", "accepted", "rejected"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter("status", s)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize",
              filters.status === s ? "bg-primary text-white" : "bg-gray-100 text-text-secondary",
            )}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {isLoading && <QueryLoading />}
      {isError && <QueryError onRetry={() => refetch()} />}
      {!isLoading && !isError && sorted.length === 0 && (
        <EmptyState icon={<Briefcase className="h-10 w-10" />} title="No bulk inquiries yet" description="Set B2B pricing tiers to attract business buyers." />
      )}

      {!isLoading && !isError && sorted.length > 0 && (
        <ul className="space-y-3">
          {sorted.map((r) => {
            const hrs = hoursUntil(r.response_deadline);
            const urgent = hrs < 24 && hrs > 0;
            return (
              <li
                key={r.id}
                className={cn(
                  "rounded-[8px] border border-border bg-card p-4",
                  urgent && "bg-red-50",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm font-semibold">{r.inquiry_number}</p>
                      {urgent && (
                        <span className="flex items-center gap-1 text-xs font-medium text-destructive">
                          <Clock className="h-3 w-3" /> {Math.round(hrs)}h left
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-lg font-semibold text-text-primary">{r.company_name}</p>
                    <p className="text-sm text-text-secondary">{r.contact_name}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <span><strong>{r.quantity}</strong> units · {r.products_count} products</span>
                  {r.budget_min && (
                    <span className="text-text-secondary">
                      Budget {formatCurrency(r.budget_min)} – {formatCurrency(r.budget_max ?? r.budget_min)}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-text-muted">{r.product_names.join(" · ")}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                  <span>Submitted {formatRelative(r.submitted_at)}</span>
                  <Link href={`/seller/dashboard/b2b/${r.id}`} className="text-primary hover:underline">View & quote →</Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
