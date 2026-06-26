"use client";

import { use } from "react";
import { ProductForm } from "@/components/seller/products/ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
      <ProductForm productId={id} />
    </div>
  );
}
