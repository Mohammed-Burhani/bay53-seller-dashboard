"use client";

import { useState } from "react";
import { useReviews } from "@/lib/queries/useModules";
import { useTableFilters } from "@/lib/hooks/useTableFilters";
import { QueryError, QueryLoading } from "@/components/seller/ui/QueryState";
import { formatDate, formatRelative } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/helpers";
import { Star, Image as ImageIcon } from "lucide-react";
import { EmptyState } from "@/components/seller/ui/EmptyState";

const DEFAULTS = { responded: "" };

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("h-4 w-4", i < rating ? "fill-warning text-warning" : "text-gray-300")}
        />
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const { filters, setFilter } = useTableFilters(DEFAULTS);
  const { data, isLoading, isError, refetch } = useReviews(filters);
  const [expanded, setExpanded] = useState<string | null>(null);

  const dist = data?.distribution ?? [];
  const avg = dist.length
    ? dist.reduce((s, d) => s + d.stars * d.count, 0) / dist.reduce((s, d) => s + d.count, 0)
    : 0;
  const respondedPct = data?.data
    ? Math.round((data.data.filter((r) => r.responded).length / data.data.length) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">Reviews</h1>

      {!isLoading && !isError && dist.length > 0 && (
        <div className="grid gap-4 rounded-[8px] border border-border bg-card p-4 lg:grid-cols-[200px_1fr]">
          <div className="text-center lg:text-left">
            <p className="text-4xl font-bold">{avg.toFixed(1)}</p>
            <StarRow rating={Math.round(avg)} />
            <p className="mt-1 text-xs text-text-muted">{dist.reduce((s, d) => s + d.count, 0)} reviews</p>
            <p className="mt-2 text-sm text-text-secondary">{respondedPct}% response rate</p>
          </div>
          <div className="space-y-1.5">
            {dist.map((d) => (
              <div key={d.stars} className="flex items-center gap-2 text-xs">
                <span className="w-8">{d.stars}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-warning" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-10 text-text-muted">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {[
          { v: "", l: "All" },
          { v: "no", l: "Needs response" },
          { v: "yes", l: "Responded" },
        ].map((f) => (
          <button
            key={f.v}
            type="button"
            onClick={() => setFilter("responded", f.v)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              filters.responded === f.v ? "bg-primary text-white" : "bg-gray-100 text-text-secondary",
            )}
          >
            {f.l}
          </button>
        ))}
      </div>

      {isLoading && <QueryLoading />}
      {isError && <QueryError onRetry={() => refetch()} />}
      {!isLoading && !isError && data?.data.length === 0 && (
        <EmptyState icon={<Star className="h-10 w-10" />} title="No reviews yet" description="Reviews appear as customers rate your products." />
      )}

      {!isLoading && !isError && data && (
        <ul className="space-y-3">
          {data.data.map((r) => (
            <li key={r.id} className="rounded-[8px] border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{r.product_name}</p>
                  <p className="text-xs text-text-secondary">{r.customer_name} · {r.customer_city}</p>
                </div>
                <div className="flex items-center gap-2">
                  {r.has_images && <ImageIcon className="h-4 w-4 text-text-muted" />}
                  <StarRow rating={r.rating} />
                </div>
              </div>
              <p className={cn("mt-2 text-sm text-text-secondary", expanded !== r.id && "line-clamp-2")}>
                {r.text}
              </p>
              {r.text.length > 120 && (
                <button type="button" className="mt-1 text-xs text-primary" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                  {expanded === r.id ? "Show less" : "Read more"}
                </button>
              )}
              {r.responded && r.response_text && (
                <div className="mt-3 rounded-[6px] bg-surface p-3 text-sm">
                  <p className="text-xs font-medium text-text-muted">Your response</p>
                  <p className="mt-1">{r.response_text}</p>
                </div>
              )}
              {!r.responded && (
                <p className="mt-2 text-xs font-medium text-warning">Awaiting your public response</p>
              )}
              <p className="mt-2 text-[10px] text-text-muted">{formatDate(r.date)} · {formatRelative(r.date)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
