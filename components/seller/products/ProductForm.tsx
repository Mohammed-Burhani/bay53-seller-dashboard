"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/seller/ui/Input";
import { Textarea } from "@/components/seller/ui/Textarea";
import { Button } from "@/components/seller/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/seller/ui/Card";
import { Skeleton } from "@/components/seller/ui/Skeleton";
import { useProduct } from "@/lib/queries/useDashboard";
import { productCreateSchema, type ProductCreateInput } from "@/lib/validations/product.schema";
import { PRODUCT_CATEGORIES, GST_RATES } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/helpers";

interface ProductFormProps {
  productId?: string;
}

export function ProductForm({ productId }: ProductFormProps) {
  const isEdit = !!productId;
  const { data: product, isLoading } = useProduct(productId ?? "");
  const [status, setStatus] = useState<"published" | "draft">("draft");
  const draftKey = `product-draft-${productId ?? "new"}`;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductCreateInput>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      min_order_qty: 1,
      low_stock_threshold: 5,
      gst_rate: 18,
      manage_stock: true,
      price_includes_gst: true,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        sku: product.sku,
        brand: product.brand ?? "",
        short_description: product.short_description ?? "",
        category_id: product.category_id,
        mrp: product.mrp,
        selling_price: product.selling_price,
        gst_rate: product.gst_rate,
        stock: product.stock,
        low_stock_threshold: product.low_stock_threshold,
        hsn_code: product.hsn_code ?? "",
        weight_kg: product.weight_kg ?? undefined,
      });
      setStatus(product.status === "published" ? "published" : "draft");
    }
  }, [product, reset]);

  const mrp = watch("mrp");
  const sellingPrice = watch("selling_price");
  const discountPct = mrp && sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

  const onSubmit = (data: ProductCreateInput) => {
    toast.success(isEdit ? "Product updated" : "Product created");
    localStorage.removeItem(draftKey);
  };

  if (isEdit && isLoading) return <Skeleton className="h-96" />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
      {Object.keys(errors).length > 0 && (
        <div className="rounded-[6px] border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Please fix {Object.keys(errors).length} error(s) before saving.
        </div>
      )}

      <Card>
        <CardHeader><h2 className="text-sm font-semibold">Basic Information</h2></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Input label="Product title" error={errors.title?.message} {...register("title")} />
          <Input label="Brand" {...register("brand")} />
          <div className="sm:col-span-2">
            <Textarea label="Short description" error={errors.short_description?.message} {...register("short_description")} />
          </div>
          <Input label="SKU" error={errors.sku?.message} {...register("sku")} />
          <Input label="HSN code" error={errors.hsn_code?.message} {...register("hsn_code")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h2 className="text-sm font-semibold">Category</h2></CardHeader>
        <CardContent>
          <select
            {...register("category_id")}
            className="h-9 w-full rounded-[6px] border border-border bg-card px-3 text-sm"
          >
            <option value="">Select category</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.category_id && <p className="mt-1 text-xs text-destructive">{errors.category_id.message}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h2 className="text-sm font-semibold">Pricing</h2></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Input label="MRP (₹)" type="number" error={errors.mrp?.message} {...register("mrp", { valueAsNumber: true })} />
          <div>
            <Input label="Selling price (₹)" type="number" error={errors.selling_price?.message} {...register("selling_price", { valueAsNumber: true })} />
            {discountPct > 0 && <p className="mt-1 text-xs text-success">{discountPct}% off</p>}
          </div>
          <div>
            <label className="text-xs font-medium">GST rate</label>
            <select {...register("gst_rate", { valueAsNumber: true })} className="mt-1.5 h-9 w-full rounded-[6px] border border-border px-3 text-sm">
              {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h2 className="text-sm font-semibold">Inventory</h2></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Input label="Available stock" type="number" error={errors.stock?.message} {...register("stock", { valueAsNumber: true })} />
          <Input label="Low stock threshold" type="number" {...register("low_stock_threshold", { valueAsNumber: true })} />
          <Input label="Weight (kg)" type="number" error={errors.weight_kg?.message} {...register("weight_kg", { valueAsNumber: true })} />
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card px-6 py-3 lg:left-64">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <div className="flex rounded-[6px] border border-border p-0.5">
            {(["draft", "published"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  "rounded-[4px] px-3 py-1.5 text-xs font-medium capitalize",
                  status === s ? "bg-primary text-white" : "text-text-secondary",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => reset()}>Discard</Button>
            <Button type="submit" variant="secondary">Save as Draft</Button>
            <Button type="submit">{isEdit ? "Update Product" : "Save & Publish"}</Button>
          </div>
        </div>
      </div>
    </form>
  );
}
