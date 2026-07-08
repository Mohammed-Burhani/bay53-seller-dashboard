import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Seller = Database["public"]["Tables"]["sellers"]["Row"];
type SellerInsert = Database["public"]["Tables"]["sellers"]["Insert"];
type SellerUpdate = Database["public"]["Tables"]["sellers"]["Update"];

export class SellerService {
  private supabase = createClient();

  /**
   * Get seller by ID
   */
  async getById(id: string): Promise<Seller> {
    const { data, error } = await this.supabase
      .from("sellers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get seller by user ID
   */
  async getByUserId(userId: string): Promise<Seller | null> {
    const { data, error } = await this.supabase
      .from("sellers")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }
    return data;
  }

  /**
   * Create a new seller profile
   */
  async create(seller: SellerInsert): Promise<Seller> {
    const { data, error } = await this.supabase
      .from("sellers")
      .insert(seller)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update seller profile
   */
  async update(id: string, updates: SellerUpdate): Promise<Seller> {
    const { data, error } = await this.supabase
      .from("sellers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get seller dashboard stats
   */
  async getDashboardStats(sellerId: string) {
    // Get product count
    const { count: productCount } = await this.supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", sellerId);

    // Get active products count
    const { count: activeProducts } = await this.supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", sellerId)
      .eq("status", "active");

    // Get low stock products - need to fetch and filter in JS
    const { data: allProducts } = await this.supabase
      .from("products")
      .select("id, stock, low_stock_threshold")
      .eq("seller_id", sellerId);

    // Filter products where stock <= low_stock_threshold
    const lowStockCount = allProducts?.filter(
      p => p.stock <= p.low_stock_threshold
    ).length || 0;

    return {
      totalProducts: productCount || 0,
      activeProducts: activeProducts || 0,
      lowStockCount,
    };
  }
}

// Export singleton instance
export const sellerService = new SellerService();
