import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];

export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export interface ProductFilters {
  status?: string;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export class ProductService {
  private supabase = createClient();

  /**
   * Get paginated products for a seller
   */
  async getProducts(
    sellerId: string,
    filters?: ProductFilters,
    pagination?: PaginationParams
  ) {
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.supabase
      .from("products")
      .select("*, images:product_images(*)", { count: "exact" })
      .eq("seller_id", sellerId);

    // Apply filters
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`
      );
    }

    if (filters?.categoryId) {
      query = query.eq("category_id", filters.categoryId);
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte("selling_price", filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte("selling_price", filters.maxPrice);
    }

    // Apply pagination and sorting
    query = query
      .order("created_at", { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      products: data as ProductWithImages[],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  }

  /**
   * Get a single product by ID
   */
  async getById(id: string): Promise<ProductWithImages> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as ProductWithImages;
  }

  /**
   * Create a new product
   */
  async create(product: ProductInsert): Promise<Product> {
    const { data, error } = await this.supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update a product
   */
  async update(id: string, updates: ProductUpdate): Promise<Product> {
    const { data, error } = await this.supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete a product
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  /**
   * Update product stock
   */
  async updateStock(id: string, stock: number): Promise<Product> {
    const { data, error } = await this.supabase
      .from("products")
      .update({ stock })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(sellerId: string): Promise<Product[]> {
    // Use a raw query to compare stock with low_stock_threshold column
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .eq("seller_id", sellerId)
      .order("stock", { ascending: true });

    if (error) throw error;
    
    // Filter in JavaScript where stock <= low_stock_threshold
    return data.filter(product => product.stock <= product.low_stock_threshold);
  }

  /**
   * Upload product image
   */
  async uploadImage(file: File, productId: string): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${productId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await this.supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = this.supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  /**
   * Add product image record
   */
  async addImage(
    productId: string,
    url: string,
    isPrimary: boolean = false
  ): Promise<ProductImage> {
    const { data, error } = await this.supabase
      .from("product_images")
      .insert({
        product_id: productId,
        url,
        is_primary: isPrimary,
        sort_order: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete product image
   */
  async deleteImage(imageId: string): Promise<void> {
    const { error } = await this.supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (error) throw error;
  }
}

// Export singleton instance
export const productService = new ProductService();
