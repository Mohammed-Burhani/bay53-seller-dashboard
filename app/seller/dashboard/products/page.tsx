"use client";

import { useState } from "react";
import { useSellerProfile } from "@/lib/hooks/useAuth";
import { useProducts, useDeleteProduct } from "@/lib/hooks/useProducts";
import { ProductFilters } from "@/components/seller/products/ProductFilters";
import { ProductList } from "@/components/seller/products/ProductList";
import { Pagination } from "@/components/seller/products/Pagination";
import { Button } from "@/components/seller/ui/Button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProductFilters as Filters } from "@/lib/services/product.service";

export default function ProductsPage() {
  const router = useRouter();
  const { data: seller } = useSellerProfile();
  const [filters, setFilters] = useState<Filters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const {
    data: productsData,
    isLoading,
    refetch,
  } = useProducts(seller?.id || "", filters, { page: currentPage, pageSize });

  const deleteMutation = useDeleteProduct();

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleEdit = (product: any) => {
    router.push(`/seller/dashboard/products/${product.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            Manage your product catalog
          </p>
        </div>
        <Link href="/seller/dashboard/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <ProductFilters onFilterChange={handleFilterChange} defaultFilters={filters} />

      {/* Results Count */}
      {productsData && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>
            Showing {productsData.products.length} of {productsData.total} products
          </p>
        </div>
      )}

      {/* Product List */}
      <ProductList
        products={productsData?.products || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage={
          Object.keys(filters).length > 0
            ? "No products match your filters"
            : "No products yet. Add your first product to get started!"
        }
      />

      {/* Pagination */}
      {productsData && productsData.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={productsData.totalPages}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
