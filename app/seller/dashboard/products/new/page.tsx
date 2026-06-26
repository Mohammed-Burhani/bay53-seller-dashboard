"use client";

import { ProductForm } from "@/components/seller/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
      <ProductForm />
    </div>
  );
}
