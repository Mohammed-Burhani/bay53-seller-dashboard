"use client";

import Link from "next/link";
import { useReturns } from "@/lib/queries/useModules";
import { useTableFilters } from "@/lib/hooks/useTableFilters";
import { QueryError, QueryLoading } from "@/components/seller/ui/QueryState";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import { Badge } from "@/components/seller/ui/Badge";
import { formatDate, formatRelative } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/helpers";
import { RefreshCcw } from "lucide-react";
import { EmptyState } from "@/components/seller/ui/EmptyState";

const DEFAULTS = { status: "" };
const STEPS = ["requested", "under_review", "approved", "rejected", "refund_completed"];

export default function ReturnsPage() {
  const { filters, setFilter } = useTableFilters(DEFAULTS);
  const { data, isLoading, isError, refetch } = useReturns(filters);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">Returns & Refunds</h1>

      <div className="flex flex-wrap gap-2">
        {["", "requested", "under_review", "approved", "rejected"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter("status", s)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize",
              filters.status === s ? "bg-primary text-white" : "bg-gray-100 text-text-secondary",
            )}
          >
            {s ? s.replace("_", " ") : "All"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {isLoading && <QueryLoading rows={3} />}
        {isError && <QueryError onRetry={() => refetch()} />}
        {!isLoading && !isError && data?.data.length === 0 && (
          <EmptyState
            icon={<RefreshCcw className="h-10 w-10" />}
            title="No return requests"
            description="Great news — your customers are satisfied!"
          />
        )}
        {!isLoading && !isError && data?.data.map((r) => {
          const stepIdx = STEPS.indexOf(r.status);
          return (
            <article key={r.id} className="rounded-[8px] border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-semibold text-primary">{r.return_number}</p>
                  <p className="text-xs text-text-secondary">Order {r.order_number}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <p className="mt-3 text-sm font-medium">{r.product_name}</p>
              <p className="mt-1 text-sm text-text-secondary line-clamp-2">&ldquo;{r.reason}&rdquo;</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant={r.return_type === "refund" ? "warning" : "primary"}>{r.return_type}</Badge>
                <span className="text-xs text-text-muted">{r.customer_name}</span>
              </div>
              <div className="mt-4 flex gap-1">
                {STEPS.slice(0, 4).map((step, i) => (
                  <div
                    key={step}
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      i <= stepIdx ? "bg-primary" : "bg-gray-200",
                    )}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                <span>{formatDate(r.requested_at)}</span>
                <span>{formatRelative(r.requested_at)}</span>
              </div>
              <Link href={`/seller/dashboard/returns/${r.id}`} className="mt-3 text-sm text-primary hover:underline">
                View details →
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
