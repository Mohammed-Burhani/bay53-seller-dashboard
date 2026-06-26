"use client";

import { usePromotions } from "@/lib/queries/useModules";
import { useTableFilters } from "@/lib/hooks/useTableFilters";
import { QueryError, QueryLoading } from "@/components/seller/ui/QueryState";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/helpers";
import { Tag } from "lucide-react";
import { EmptyState } from "@/components/seller/ui/EmptyState";

const DEFAULTS = { status: "" };

function PromoPreview({ type, value, samplePrice, title }: { type: string; value: number; samplePrice: number; title: string }) {
  let discounted = samplePrice;
  if (type === "percentage") discounted = samplePrice * (1 - value / 100);
  if (type === "flat") discounted = samplePrice - value;

  return (
    <div className="mt-3 rounded-[6px] bg-surface p-3">
      <p className="text-[10px] font-medium uppercase text-text-muted">Listing preview</p>
      <p className="mt-1 text-xs font-medium text-primary">{title}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-bold">{formatCurrency(Math.round(discounted))}</span>
        <span className="text-sm text-text-muted line-through">{formatCurrency(samplePrice)}</span>
        {type === "percentage" && (
          <span className="rounded-full bg-destructive/12 px-2 py-0.5 text-xs font-medium text-destructive">
            {value}% OFF
          </span>
        )}
      </div>
    </div>
  );
}

export default function PromotionsPage() {
  const { filters, setFilter } = useTableFilters(DEFAULTS);
  const { data, isLoading, isError, refetch } = usePromotions(filters);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">Promotions</h1>

      <div className="flex gap-2">
        {["", "active", "scheduled", "expired"].map((s) => (
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
      {!isLoading && !isError && data?.data.length === 0 && (
        <EmptyState icon={<Tag className="h-10 w-10" />} title="No promotions" description="Run your first discount to boost visibility." />
      )}

      {!isLoading && !isError && data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((p) => (
            <article key={p.id} className="rounded-[8px] border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-text-primary">{p.name}</p>
                  <p className="text-xs text-text-muted capitalize">{p.type} · {p.apply_to}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <PromoPreview type={p.type} value={p.value} samplePrice={p.sample_price} title={p.buyer_title} />
              <div className="mt-3 flex justify-between text-xs text-text-secondary">
                <span>Uses {p.uses}{p.max_uses ? `/${p.max_uses}` : ""}</span>
                <span>{formatDate(p.start_at)} – {p.end_at ? formatDate(p.end_at) : "Open"}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
