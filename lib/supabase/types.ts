export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      sellers: {
        Row: {
          id: string;
          user_id: string;
          store_name: string;
          business_type: string;
          gst_number: string | null;
          pan_number: string | null;
          kyc_status: "pending" | "approved" | "rejected" | "partial";
          onboarding_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sellers"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["sellers"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          title: string;
          sku: string;
          brand: string | null;
          short_description: string | null;
          full_description: string | null;
          category_id: string;
          subcategory_id: string | null;
          specs: Json;
          mrp: number;
          selling_price: number;
          gst_rate: number;
          price_includes_gst: boolean;
          min_order_qty: number;
          stock: number;
          low_stock_threshold: number;
          sku_type: string;
          manage_stock: boolean;
          status: string;
          weight_kg: number | null;
          hsn_code: string | null;
          seo_title: string | null;
          meta_description: string | null;
          slug: string;
          search_tags: string[];
          has_variants: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          is_primary: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_images"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          sku: string;
          mrp: number;
          selling_price: number;
          stock: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_variants"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
      };
      inventory_log: {
        Row: {
          id: string;
          product_id: string;
          adjustment_type: string;
          quantity_change: number;
          resulting_stock: number;
          notes: string | null;
          changed_by: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["inventory_log"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["inventory_log"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          seller_id: string;
          order_number: string;
          customer_id: string;
          status: string;
          payment_method: string;
          delivery_type: string;
          subtotal: number;
          commission: number;
          gst: number;
          shipping_fee: number;
          discount: number;
          net_earnings: number;
          total_amount: number;
          placed_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      order_timeline_events: {
        Row: {
          id: string;
          order_id: string;
          event: string;
          occurred_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["order_timeline_events"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["order_timeline_events"]["Insert"]>;
      };
      returns: {
        Row: {
          id: string;
          order_id: string;
          seller_id: string;
          status: string;
          reason: string;
          return_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["returns"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["returns"]["Insert"]>;
      };
      return_timeline_events: {
        Row: {
          id: string;
          return_id: string;
          event: string;
          occurred_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["return_timeline_events"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["return_timeline_events"]["Insert"]>;
      };
      shipments: {
        Row: {
          id: string;
          order_id: string;
          courier: string | null;
          awb_number: string | null;
          label_status: string;
          status: string;
          estimated_delivery: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["shipments"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["shipments"]["Insert"]>;
      };
      tracking_events: {
        Row: {
          id: string;
          shipment_id: string;
          event: string;
          location: string | null;
          occurred_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tracking_events"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["tracking_events"]["Insert"]>;
      };
      transactions: {
        Row: {
          id: string;
          seller_id: string;
          type: string;
          order_id: string | null;
          gross_amount: number;
          deductions: number;
          net_amount: number;
          running_balance: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["transactions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
      };
      payouts: {
        Row: {
          id: string;
          seller_id: string;
          period_start: string;
          period_end: string;
          orders_count: number;
          gross_earnings: number;
          deductions: number;
          net_payout: number;
          bank_account_masked: string;
          status: string;
          payout_date: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payouts"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["payouts"]["Insert"]>;
      };
      promotions: {
        Row: {
          id: string;
          seller_id: string;
          name: string;
          buyer_title: string;
          type: string;
          value: number;
          apply_to: string;
          status: string;
          start_at: string;
          end_at: string | null;
          max_uses: number | null;
          uses_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["promotions"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["promotions"]["Insert"]>;
      };
      promotion_usage: {
        Row: {
          id: string;
          promotion_id: string;
          order_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["promotion_usage"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["promotion_usage"]["Insert"]>;
      };
      rfq_inquiries: {
        Row: {
          id: string;
          seller_id: string;
          company_name: string;
          contact_name: string;
          status: string;
          response_deadline: string;
          submitted_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["rfq_inquiries"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["rfq_inquiries"]["Insert"]>;
      };
      rfq_line_items: {
        Row: {
          id: string;
          inquiry_id: string;
          product_name: string;
          quantity: number;
          target_price: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["rfq_line_items"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["rfq_line_items"]["Insert"]>;
      };
      rfq_quotes: {
        Row: {
          id: string;
          inquiry_id: string;
          version: number;
          total: number;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["rfq_quotes"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["rfq_quotes"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          seller_id: string;
          rating: number;
          review_text: string;
          customer_name: string;
          customer_city: string;
          has_images: boolean;
          seller_response: string | null;
          responded_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      seller_notifications: {
        Row: {
          id: string;
          seller_id: string;
          type: string;
          title: string;
          detail: string;
          link: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["seller_notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["seller_notifications"]["Insert"]>;
      };
      support_tickets: {
        Row: {
          id: string;
          seller_id: string;
          subject: string;
          category: string;
          priority: string;
          status: string;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["support_tickets"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["support_tickets"]["Insert"]>;
      };
      support_messages: {
        Row: {
          id: string;
          ticket_id: string;
          sender_type: "seller" | "agent";
          sender_name: string;
          body: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["support_messages"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["support_messages"]["Insert"]>;
      };
      team_members: {
        Row: {
          id: string;
          seller_id: string;
          name: string;
          email: string;
          role: string;
          status: string;
          last_login: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["team_members"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
      };
      api_keys: {
        Row: {
          id: string;
          seller_id: string;
          name: string;
          key_prefix: string;
          scopes: string[];
          status: string;
          last_used: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["api_keys"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["api_keys"]["Insert"]>;
      };
      kyc_documents: {
        Row: {
          id: string;
          seller_id: string;
          document_type: string;
          file_name: string | null;
          status: string;
          rejection_reason: string | null;
          uploaded_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["kyc_documents"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["kyc_documents"]["Insert"]>;
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
