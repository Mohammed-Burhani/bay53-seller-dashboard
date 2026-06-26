"use client";

import { useInventory } from "@/lib/queries/useModules";
import { useTableFilters } from "@/lib/hooks/useTableFilters";
import { QueryError, QueryLoading } from "@/components/seller/ui/QueryState";
import { cn } from "@/lib/utils/helpers";
import { formatRelative } from "@/lib/utils/formatters";
import { Package, Warehouse } from "lucide-react";
import { EmptyState } from "@/components/seller/ui/EmptyState";

const DEFAULTS = { stock: "" };

function StockGauge({ stock, reserved, max, threshold }: { stock: number; reserved: number; max: number; threshold: number }) {
  const available = stock - reserved;
  const pct = max > 0 ? (stock / max) * 100 : 0;
  const level = stock === 0 ? "critical" : stock <= threshold ? "low" : "ok";

  return (
    <div className="w-full max-w-xs">
      <div className="flex justify-between text-[10px] font-medium uppercase tracking-wide text-text-muted">
        <span>Available {available}</span>
        <span>Reserved {reserved}</span>
      </div>
      <div className="relative mt-1 h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            level === "critical" && "bg-destructive",
            level === "low" && "bg-warning",
            level === "ok" && "bg-success",
          )}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <p className="mt-0.5 text-[10px] text-text-muted">Max capacity {max}</p>
    </div>
  );
}

export default function InventoryPage() {
  const { filters, setFilter } = useTableFilters(DEFAULTS);
  const { data, isLoading, isError, refetch } = useInventory(filters);

  const stats = data?.data
    ? {
        total: data.data.length,
        inStock: data.data.filter((i) => i.stock > i.threshold).length,
        low: data.data.filter((i) => i.stock > 0 && i.stock <= i.threshold).length,
        out: data.data.filter((i) => i.stock === 0).length,
      }
    : null;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary" style={{ textWrap: "balance" }}>
            Inventory
          </h1>
          <p className="text-sm text-text-secondary">Stock levels with reserved units from open orders</p>
        </div>
        {stats && (
          <div className="flex gap-6 text-center">
            {[
              { label: "SKUs", value: stats.total },
              { label: "In stock", value: stats.inStock },
              { label: "Low", value: stats.low, warn: true },
              { label: "Out", value: stats.out, crit: true },
            ].map((s) => (
              <div key={s.label}>
                <p className={cn("text-xl font-bold", s.crit && "text-destructive", s.warn && "text-warning")}>{s.value}</p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {[
          { key: "", label: "All" },
          { key: "in", label: "In stock" },
          { key: "low", label: "Low stock" },
          { key: "out", label: "Out of stock" },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter("stock", f.key)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              filters.stock === f.key ? "bg-primary text-white" : "bg-gray-100 text-text-secondary hover:bg-gray-200",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-[8px] border border-border bg-card">
        {isLoading && <QueryLoading />}
        {isError && <QueryError onRetry={() => refetch()} />}
        {!isLoading && !isError && data?.data.length === 0 && (
          <EmptyState icon={<Warehouse className="h-10 w-10" />} title="No inventory matches" description="Adjust filters or add products." />
        )}
        {!isLoading && !isError && data && data.data.length > 0 && (
          <ul className="divide-y divide-border">
            {data.data.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-4 px-4 py-4 hover:bg-surface/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-surface">
                  <Package className="h-5 w-5 text-text-muted" />
                </div>
                <div className="min-w-[180px] flex-1">
                  <p className="font-medium text-text-primary">{item.name}</p>
                  <p className="font-mono text-xs text-text-secondary">{item.sku} · {item.category}</p>
                </div>
                <StockGauge stock={item.stock} reserved={item.reserved} max={item.max_capacity} threshold={item.threshold} />
                <p className="text-xs text-text-muted">{formatRelative(item.last_updated)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
