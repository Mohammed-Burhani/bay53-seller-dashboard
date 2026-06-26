"use client";

import { useShipments } from "@/lib/queries/useModules";
import { QueryError, QueryLoading } from "@/components/seller/ui/QueryState";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import { formatDate } from "@/lib/utils/formatters";
import { Truck } from "lucide-react";
import Link from "next/link";

const COLUMNS = [
  { key: "pending_label", label: "Pending label" },
  { key: "in_transit", label: "In transit" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function ShippingPage() {
  const { data, isLoading, isError, refetch } = useShipments({});

  const byStatus = (status: string) => data?.data.filter((s) => s.status === status) ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Shipping</h1>
        <p className="text-sm text-text-secondary">Fulfillment pipeline — drag columns scroll on mobile</p>
      </div>

      {isLoading && <QueryLoading />}
      {isError && <QueryError onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {COLUMNS.map((col) => (
            <div key={col.key} className="min-w-[260px] flex-1 rounded-[8px] bg-surface p-3">
              <div className="mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-text-muted" />
                <h2 className="text-sm font-semibold">{col.label}</h2>
                <span className="rounded-full bg-card px-2 py-0.5 text-xs font-medium text-text-secondary">
                  {byStatus(col.key).length}
                </span>
              </div>
              <ul className="space-y-2">
                {byStatus(col.key).map((s) => (
                  <li key={s.id} className="rounded-[8px] border border-border bg-card p-3">
                    <Link href={`/seller/dashboard/shipping/${s.id}`} className="font-mono text-sm font-medium text-primary">
                      {s.order_number}
                    </Link>
                    <p className="mt-1 text-xs text-text-secondary">{s.customer_city}, {s.customer_state}</p>
                    <p className="text-xs text-text-muted">{s.items_count} items · {s.weight_kg} kg</p>
                    {s.awb && <p className="mt-1 font-mono text-[10px] text-text-secondary">{s.courier} · {s.awb}</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <StatusBadge status={s.status.replace("_", " ")} />
                      {s.estimated_delivery && (
                        <span className="text-[10px] text-text-muted">ETA {formatDate(s.estimated_delivery)}</span>
                      )}
                    </div>
                  </li>
                ))}
                {byStatus(col.key).length === 0 && (
                  <li className="rounded-[8px] border border-dashed border-border p-4 text-center text-xs text-text-muted">
                    No shipments
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
