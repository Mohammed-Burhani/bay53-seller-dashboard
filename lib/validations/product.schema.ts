import { z } from "zod";

export const productBaseSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Max 150 characters"),
  brand: z.string().optional(),
  short_description: z.string().max(300, "Max 300 characters").optional(),
  sku: z.string().min(1, "SKU is required"),
  category_id: z.string().min(1, "Category is required"),
  mrp: z.number().positive("MRP must be positive"),
  selling_price: z.number().positive(),
  gst_rate: z.number(),
  price_includes_gst: z.boolean().optional(),
  min_order_qty: z.number().min(1).optional(),
  stock: z.number().min(0),
  low_stock_threshold: z.number().min(0).optional(),
  manage_stock: z.boolean().optional(),
  weight_kg: z.number().positive(),
  hsn_code: z.string().min(1, "HSN code is required"),
});

export const productCreateSchema = productBaseSchema.refine(
  (data) => data.selling_price <= data.mrp,
  { message: "Selling price must be ≤ MRP", path: ["selling_price"] },
);

export const productUpdateSchema = productBaseSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
