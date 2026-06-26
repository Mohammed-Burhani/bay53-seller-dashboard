"use client";

import { use } from "react";
import { mockReturns } from "@/lib/mock/modules";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import Link from "next/link";

export default function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = mockReturns.find((r) => r.id === id);

  if (!item) return <p className="text-text-secondary">Return not found.</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <Link href="/seller/dashboard/returns" className="text-sm text-primary hover:underline">← Returns</Link>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold font-mono">{item.return_number}</h1>
        <StatusBadge status={item.status} />
      </div>
      <p className="text-sm text-text-secondary">Order {item.order_number} · {item.customer_name}</p>
      <div className="rounded-[8px] border border-border bg-card p-4">
        <p className="font-medium">{item.product_name}</p>
        <p className="mt-2 text-sm">&ldquo;{item.reason}&rdquo;</p>
        <p className="mt-2 text-xs capitalize text-text-muted">{item.return_type}</p>
      </div>
    </div>
  );
}
