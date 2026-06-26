"use client";

import { use } from "react";
import { mockCustomers } from "@/lib/mock/modules";
import { Badge } from "@/components/seller/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import Link from "next/link";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const c = mockCustomers.find((x) => x.id === id);

  if (!c) return <p className="text-text-secondary">Customer not found.</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <Link href="/seller/dashboard/customers" className="text-sm text-primary hover:underline">← Customers</Link>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{c.name}</h1>
        <Badge variant={c.buyer_type === "b2b" ? "primary" : "default"}>{c.buyer_type.toUpperCase()}</Badge>
      </div>
      <p className="text-sm text-text-secondary">{c.city}, {c.state}</p>
      <div className="grid grid-cols-3 gap-4 rounded-[8px] border border-border bg-card p-4 text-center">
        <div>
          <p className="text-2xl font-bold">{c.total_orders}</p>
          <p className="text-xs text-text-muted">Orders</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{formatCurrency(c.total_spend)}</p>
          <p className="text-xs text-text-muted">Total spend</p>
        </div>
        <div>
          <p className="text-sm font-medium">{formatDate(c.last_order_at)}</p>
          <p className="text-xs text-text-muted">Last order</p>
        </div>
      </div>
      <p className="text-xs text-text-muted">Contact details are platform-mediated — not shown to sellers.</p>
    </div>
  );
}
