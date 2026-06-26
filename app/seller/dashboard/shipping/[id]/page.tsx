"use client";

import { use } from "react";
import { mockShipments } from "@/lib/mock/modules";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import Link from "next/link";
import { formatDate } from "@/lib/utils/formatters";

export default function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = mockShipments.find((s) => s.id === id);

  if (!item) return <p className="text-text-secondary">Shipment not found.</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <Link href="/seller/dashboard/shipping" className="text-sm text-primary hover:underline">← Shipping</Link>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold font-mono">{item.order_number}</h1>
        <StatusBadge status={item.status} />
      </div>
      <div className="rounded-[8px] border border-border bg-card p-4 space-y-2 text-sm">
        <p>{item.customer_city}, {item.customer_state}</p>
        <p>{item.items_count} items · {item.weight_kg} kg</p>
        {item.courier && <p className="font-mono">{item.courier} · {item.awb}</p>}
        {item.estimated_delivery && <p className="text-text-muted">ETA {formatDate(item.estimated_delivery)}</p>}
      </div>
    </div>
  );
}
