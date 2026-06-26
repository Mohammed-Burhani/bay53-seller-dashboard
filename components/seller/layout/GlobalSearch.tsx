"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchInput } from "../ui/SearchInput";
import { StatusBadge } from "../ui/StatusBadge";
import { mockOrders, mockProducts } from "@/lib/mock/data";
import { formatCurrency } from "@/lib/utils/formatters";
import { X } from "lucide-react";

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  if (!open) return null;

  const q = query.toLowerCase();
  const products = q
    ? mockProducts.filter((p) => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)).slice(0, 5)
    : [];
  const orders = q
    ? mockOrders.filter((o) => o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q)).slice(0, 5)
    : [];

  const navigate = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40" onClick={onClose}>
      <div
        className="mx-auto mt-[10vh] w-full max-w-2xl rounded-[8px] border border-border bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border p-3">
          <SearchInput value={query} onChange={setQuery} placeholder="Search products, orders, customers..." />
          <button type="button" onClick={onClose} className="p-2 text-text-secondary hover:bg-surface rounded-[6px]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query && products.length === 0 && orders.length === 0 && (
            <p className="p-4 text-sm text-text-secondary">No results for &quot;{query}&quot;</p>
          )}
          {products.length > 0 && (
            <div className="mb-3">
              <p className="px-2 py-1 text-xs font-medium uppercase text-text-muted">Products</p>
              {products.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-left hover:bg-surface"
                  onClick={() => navigate(`/seller/dashboard/products/${p.id}`)}
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{p.title}</p>
                    <p className="font-mono text-xs text-text-secondary">{p.sku}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </button>
              ))}
            </div>
          )}
          {orders.length > 0 && (
            <div>
              <p className="px-2 py-1 text-xs font-medium uppercase text-text-muted">Orders</p>
              {orders.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-left hover:bg-surface"
                  onClick={() => navigate(`/seller/dashboard/orders/${o.id}`)}
                >
                  <div>
                    <p className="font-mono text-sm font-medium text-text-primary">{o.order_number}</p>
                    <p className="text-xs text-text-secondary">{o.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(o.total_amount)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
