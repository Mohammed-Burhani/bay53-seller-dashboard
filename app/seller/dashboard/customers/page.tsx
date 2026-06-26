"use client";

import Link from "next/link";
import { useCustomers } from "@/lib/queries/useModules";
import { useTableFilters } from "@/lib/hooks/useTableFilters";
import { QueryError, QueryLoading } from "@/components/seller/ui/QueryState";
import { Badge } from "@/components/seller/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/helpers";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/seller/ui/EmptyState";

const DEFAULTS = { type: "", status: "" };

export default function CustomersPage() {
  const { filters, setFilter } = useTableFilters(DEFAULTS);
  const { data, isLoading, isError, refetch } = useCustomers(filters);

  const maxSpend = data?.data ? Math.max(...data.data.map((c) => c.total_spend)) : 1;
  const sorted = data?.data ? [...data.data].sort((a, b) => b.total_spend - a.total_spend) : [];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">Customers</h1>

      <div className="flex gap-2">
        {[
          { k: "type", v: "", l: "All types" },
          { k: "type", v: "b2c", l: "B2C" },
          { k: "type", v: "b2b", l: "B2B" },
        ].map((f) => (
          <button
            key={f.v}
            type="button"
            onClick={() => setFilter("type", f.v)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              filters.type === f.v ? "bg-primary text-white" : "bg-gray-100 text-text-secondary",
            )}
          >
            {f.l}
          </button>
        ))}
      </div>

      {isLoading && <QueryLoading />}
      {isError && <QueryError onRetry={() => refetch()} />}
      {!isLoading && !isError && sorted.length === 0 && (
        <EmptyState icon={<Users className="h-10 w-10" />} title="No customers yet" description="Customers appear after their first order." />
      )}

      {!isLoading && !isError && sorted.length > 0 && (
        <ol className="space-y-2">
          {sorted.map((c, rank) => {
            const pct = (c.total_spend / maxSpend) * 100;
            return (
              <li key={c.id} className="rounded-[8px] border border-border bg-card p-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-bold text-text-secondary">
                    {rank + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/seller/dashboard/customers/${c.id}`} className="font-medium text-text-primary hover:text-primary">
                        {c.name}
                      </Link>
                      <Badge variant={c.buyer_type === "b2b" ? "primary" : "default"}>{c.buyer_type.toUpperCase()}</Badge>
                      {c.status === "inactive" && <Badge variant="warning">Inactive</Badge>}
                    </div>
                    <p className="text-xs text-text-secondary">{c.city}, {c.state}</p>
                    <div className="mt-2 h-2 max-w-md overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(c.total_spend)}</p>
                    <p className="text-xs text-text-muted">{c.total_orders} orders</p>
                    <p className="text-[10px] text-text-muted">Last {formatDate(c.last_order_at)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
