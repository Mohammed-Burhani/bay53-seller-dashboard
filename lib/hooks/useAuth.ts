"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const AUTH_KEYS = {
  session: ["auth", "session"] as const,
  user: ["auth", "user"] as const,
  seller: ["auth", "seller"] as const,
};

/**
 * Hook to get current session
 */
export function useSession() {
  return useQuery({
    queryKey: AUTH_KEYS.session,
    queryFn: () => authService.getSession(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

/**
 * Hook to get seller profile
 */
export function useSellerProfile() {
  return useQuery({
    queryKey: AUTH_KEYS.seller,
    queryFn: () => authService.getSellerProfile(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

/**
 * Hook to handle logout
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/seller/auth/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to logout");
    },
  });
}

/**
 * Hook to handle password reset request
 */
export function usePasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authService.resetPassword(email),
    onSuccess: () => {
      toast.success("Password reset link sent to your email!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send reset email");
    },
  });
}

/**
 * Hook to handle password update
 */
export function usePasswordUpdate() {
  const router = useRouter();

  return useMutation({
    mutationFn: (newPassword: string) => authService.updatePassword(newPassword),
    onSuccess: () => {
      toast.success("Password updated successfully!");
      setTimeout(() => router.push("/seller/dashboard"), 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update password");
    },
  });
}
