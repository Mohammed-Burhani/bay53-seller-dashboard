"use client";

import Link from "next/link";
import { useOrders } from "@/lib/queries/useDashboard";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useTableFilters } from "@/lib/hooks/useTableFilters";
import { SearchInput } from "@/components/seller/ui/SearchInput";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import { SkeletonTable } from "@/components/seller/ui/Skeleton";
import { EmptyState } from "@/components/seller/ui/EmptyState";
import { Card } from "@/components/seller/ui/Card";
import { Button } from "@/components/seller/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { ORDER_STATUSES } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/helpers";

const FILTER_DEFAULTS = { search: "", status: "", page: "1" };

export default function OrdersPage() {
  const { filters, setFilter } = useTableFilters(FILTER_DEFAULTS);
  const debouncedSearch = useDebounce(filters.search);
  const { data, isLoading, isError, refetch } = useOrders({
    search: debouncedSearch,
    status: filters.status,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("status", "")}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            !filters.status ? "bg-primary text-white" : "bg-gray-100 text-text-secondary",
          )}
        >
          All
        </button>
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter("status", s)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize",
              filters.status === s ? "bg-primary text-white" : "bg-gray-100 text-text-secondary",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="w-64">
        <SearchInput
          value={filters.search}
          onChange={(v) => setFilter("search", v)}
          placeholder="Order ID or customer"
        />
      </div>

      <Card>
        {isLoading && <div className="p-4"><SkeletonTable /></div>}
        {isError && (
          <div className="p-6 text-center">
            <p className="text-sm text-text-secondary">Couldn&apos;t load orders.</p>
            <Button className="mt-2" variant="secondary" onClick={() => refetch()}>Try again</Button>
          </div>
        )}
        {!isLoading && !isError && data?.data.length === 0 && (
          <EmptyState
            title={filters.search || filters.status ? "No orders match these filters" : "No orders yet"}
            description="Published products will receive orders from buyers."
          />
        )}
        {!isLoading && !isError && data && data.data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((o, i) => (
                  <tr key={o.id} className={`h-12 border-b border-border hover:bg-gray-50 ${i % 2 === 1 ? "bg-gray-50" : ""}`}>
                    <td className="px-4 py-2 font-mono text-primary">
                      <Link href={`/seller/dashboard/orders/${o.id}`}>{o.order_number}</Link>
                    </td>
                    <td className="px-4 py-2">
                      <p>{o.customer_name}</p>
                      <p className="text-xs text-text-secondary">{o.customer_city}</p>
                    </td>
                    <td className="px-4 py-2">{o.item_count} items</td>
                    <td className="px-4 py-2 font-medium">{formatCurrency(o.total_amount)}</td>
                    <td className="px-4 py-2 capitalize text-text-secondary">{o.payment_method.replace("_", " ")}</td>
                    <td className="px-4 py-2 text-text-secondary">{formatDate(o.placed_at)}</td>
                    <td className="px-4 py-2"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-2">
                      <Link href={`/seller/dashboard/orders/${o.id}`} className="text-primary hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
