"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { useProducts } from "@/lib/queries/useDashboard";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useTableFilters } from "@/lib/hooks/useTableFilters";
import { SearchInput } from "@/components/seller/ui/SearchInput";
import { Button } from "@/components/seller/ui/Button";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import { SkeletonTable } from "@/components/seller/ui/Skeleton";
import { EmptyState } from "@/components/seller/ui/EmptyState";
import { Card } from "@/components/seller/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { AlertCircle } from "lucide-react";

const FILTER_DEFAULTS = { search: "", status: "", page: "1" };

export default function ProductsPage() {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useTableFilters(FILTER_DEFAULTS);
  const debouncedSearch = useDebounce(filters.search);
  const { data, isLoading, isError, refetch } = useProducts({
    search: debouncedSearch,
    status: filters.status,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <div className="flex gap-2">
          <Link
            href="/seller/dashboard/products/bulk-upload"
            className="inline-flex h-9 items-center rounded-[6px] border border-border px-4 text-sm font-medium hover:bg-surface"
          >
            Bulk Upload
          </Link>
          <Link
            href="/seller/dashboard/products/new"
            className="inline-flex h-9 items-center rounded-[6px] bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Add Product
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-64">
          <SearchInput value={filters.search} onChange={(v) => setFilter("search", v)} placeholder="Search name or SKU" />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilter("status", e.target.value)}
          className="h-9 rounded-[6px] border border-border bg-card px-3 text-sm"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
          <option value="pending_review">Pending Review</option>
        </select>
        {hasActiveFilters && (
          <button type="button" onClick={resetFilters} className="text-sm text-primary hover:underline">
            Reset filters
          </button>
        )}
      </div>

      <Card>
        {isLoading && <div className="p-4"><SkeletonTable rows={5} cols={6} /></div>}
        {isError && (
          <div className="p-6 text-center">
            <AlertCircle className="mx-auto h-6 w-6 text-destructive" />
            <p className="mt-2 text-sm text-text-secondary">Couldn&apos;t load products.</p>
            <Button className="mt-2" variant="secondary" onClick={() => refetch()}>Try again</Button>
          </div>
        )}
        {!isLoading && !isError && data?.data.length === 0 && (
          <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="No products listed yet"
            description="Start selling by listing your first product."
            actionLabel="List your first product"
            onAction={() => window.location.href = "/seller/dashboard/products/new"}
          />
        )}
        {!isLoading && !isError && data && data.data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 border-b border-border bg-card">
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">MRP</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Listed</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((p, i) => (
                  <tr key={p.id} className={`h-12 border-b border-border hover:bg-gray-50 ${i % 2 === 1 ? "bg-gray-50" : ""}`}>
                    <td className="px-4 py-2">
                      <p className="font-medium text-text-primary">{p.title}</p>
                      <p className="font-mono text-xs text-text-secondary">{p.sku}</p>
                    </td>
                    <td className="px-4 py-2 text-text-secondary">{p.category_id}</td>
                    <td className="px-4 py-2 font-medium">{formatCurrency(p.selling_price)}</td>
                    <td className="px-4 py-2 text-text-muted line-through">{formatCurrency(p.mrp)}</td>
                    <td className="px-4 py-2">
                      <span className={
                        p.stock === 0 ? "text-destructive font-medium" :
                        p.stock <= 10 ? "text-warning font-medium" : "text-success font-medium"
                      }>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-2"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-2 text-text-secondary">{formatDate(p.created_at)}</td>
                    <td className="px-4 py-2">
                      <Link href={`/seller/dashboard/products/${p.id}`} className="text-primary hover:underline">Edit</Link>
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
