"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sellerService } from "@/lib/services/seller.service";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/types";

type SellerUpdate = Database["public"]["Tables"]["sellers"]["Update"];

export const SELLER_KEYS = {
  all: ["sellers"] as const,
  detail: (id: string) => ["sellers", id] as const,
  byUser: (userId: string) => ["sellers", "user", userId] as const,
  stats: (id: string) => ["sellers", id, "stats"] as const,
};

/**
 * Hook to get seller by ID
 */
export function useSeller(id: string) {
  return useQuery({
    queryKey: SELLER_KEYS.detail(id),
    queryFn: () => sellerService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to get seller by user ID
 */
export function useSellerByUserId(userId: string) {
  return useQuery({
    queryKey: SELLER_KEYS.byUser(userId),
    queryFn: () => sellerService.getByUserId(userId),
    enabled: !!userId,
  });
}

/**
 * Hook to get seller dashboard stats
 */
export function useSellerStats(sellerId: string) {
  return useQuery({
    queryKey: SELLER_KEYS.stats(sellerId),
    queryFn: () => sellerService.getDashboardStats(sellerId),
    enabled: !!sellerId,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to update seller profile
 */
export function useUpdateSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: SellerUpdate }) =>
      sellerService.update(id, updates),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: SELLER_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: SELLER_KEYS.byUser(data.user_id) });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}
