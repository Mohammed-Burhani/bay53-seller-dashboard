"use client";

import { use } from "react";
import { mockRfqs } from "@/lib/mock/modules";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import Link from "next/link";

export default function RfqDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = mockRfqs.find((r) => r.id === id);

  if (!item) return <p className="text-text-secondary">RFQ not found.</p>;

  return (
    <div className="max-w-3xl space-y-4">
      <Link href="/seller/dashboard/b2b" className="text-sm text-primary hover:underline">← B2B / RFQ</Link>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{item.company_name}</h1>
        <StatusBadge status={item.status} />
      </div>
      <p className="font-mono text-sm text-text-secondary">{item.inquiry_number}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[8px] border border-border bg-card p-4 text-sm space-y-2">
          <p><strong>Contact:</strong> {item.contact_name}</p>
          <p><strong>Quantity:</strong> {item.quantity} units</p>
          <p><strong>Products:</strong> {item.product_names.join(", ")}</p>
          {item.budget_min && (
            <p><strong>Budget:</strong> {formatCurrency(item.budget_min)} – {formatCurrency(item.budget_max ?? item.budget_min)}</p>
          )}
          <p className="text-text-muted">Deadline {formatDate(item.response_deadline)}</p>
        </div>
        <div className="rounded-[8px] border border-border bg-card p-4">
          <p className="text-sm font-semibold">Quote builder</p>
          <p className="mt-2 text-sm text-text-secondary">Quote form coming in next phase.</p>
        </div>
      </div>
    </div>
  );
}
