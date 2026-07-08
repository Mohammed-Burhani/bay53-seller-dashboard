"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/seller/ui/Card";
import { Button } from "@/components/seller/ui/Button";
import { MoreVertical, Edit, Trash2, Package } from "lucide-react";
import type { ProductWithImages } from "@/lib/services/product.service";
import Image from "next/image";

interface ProductCardProps {
  product: ProductWithImages;
  onEdit?: (product: ProductWithImages) => void;
  onDelete?: (id: string) => void;
  onUpdateStock?: (id: string, stock: number) => void;
}

export function ProductCard({ product, onEdit, onDelete, onUpdateStock }: ProductCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const stockStatus = product.stock <= product.low_stock_threshold ? "low" : "ok";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-gray-100">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {stockStatus === "low" && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Low Stock
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{product.title}</h3>
            <p className="text-xs text-gray-500">{product.sku}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onEdit?.(product);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this product?")) {
                      onDelete?.(product.id);
                    }
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Price</span>
            <span className="font-semibold">₹{product.selling_price.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Stock</span>
            <span className={`font-medium ${stockStatus === "low" ? "text-red-600" : ""}`}>
              {product.stock} units
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Status</span>
            <span
              className={`text-xs px-2 py-1 rounded ${
                product.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {product.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
