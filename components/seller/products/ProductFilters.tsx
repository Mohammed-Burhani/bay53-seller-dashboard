"use client";

import { useState } from "react";
import { Input } from "@/components/seller/ui/Input";
import { Button } from "@/components/seller/ui/Button";
import { Search, Filter, X } from "lucide-react";
import type { ProductFilters as Filters } from "@/lib/services/product.service";

interface ProductFiltersProps {
  onFilterChange: (filters: Filters) => void;
  defaultFilters?: Filters;
}

export function ProductFilters({ onFilterChange, defaultFilters }: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(defaultFilters?.search || "");
  const [status, setStatus] = useState(defaultFilters?.status || "");
  const [minPrice, setMinPrice] = useState(defaultFilters?.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(defaultFilters?.maxPrice?.toString() || "");

  const handleApplyFilters = () => {
    onFilterChange({
      search: search || undefined,
      status: status || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setMinPrice("");
    setMaxPrice("");
    onFilterChange({});
  };

  const hasActiveFilters = search || status || minPrice || maxPrice;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApplyFilters();
            }}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              !
            </span>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={handleClearFilters} size="sm">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Min Price
              </label>
              <Input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Max Price
              </label>
              <Input
                type="number"
                placeholder="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setShowFilters(false)} size="sm">
              Cancel
            </Button>
            <Button onClick={handleApplyFilters} size="sm">
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
