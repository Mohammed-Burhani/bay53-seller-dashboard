"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { productService, type ProductFilters, type PaginationParams } from "@/lib/services/product.service";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/types";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  list: (sellerId: string, filters?: ProductFilters, pagination?: PaginationParams) =>
    [...PRODUCT_KEYS.lists(), sellerId, filters, pagination] as const,
  detail: (id: string) => [...PRODUCT_KEYS.all, id] as const,
  lowStock: (sellerId: string) => [...PRODUCT_KEYS.all, "low-stock", sellerId] as const,
};

/**
 * Hook to get paginated products
 */
export function useProducts(
  sellerId: string,
  filters?: ProductFilters,
  pagination?: PaginationParams
) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(sellerId, filters, pagination),
    queryFn: () => productService.getProducts(sellerId, filters, pagination),
    enabled: !!sellerId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to get infinite scroll products
 */
export function useInfiniteProducts(
  sellerId: string,
  filters?: ProductFilters,
  pageSize: number = 10
) {
  return useInfiniteQuery({
    queryKey: [...PRODUCT_KEYS.lists(), sellerId, filters, "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      productService.getProducts(sellerId, filters, { page: pageParam, pageSize }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: !!sellerId,
    initialPageParam: 1,
  });
}

/**
 * Hook to get single product
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to get low stock products
 */
export function useLowStockProducts(sellerId: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.lowStock(sellerId),
    queryFn: () => productService.getLowStockProducts(sellerId),
    enabled: !!sellerId,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to create a product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: ProductInsert) => productService.create(product),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      toast.success("Product created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product");
    },
  });
}

/**
 * Hook to update a product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ProductUpdate }) =>
      productService.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      toast.success("Product updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product");
    },
  });
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      toast.success("Product deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });
}

/**
 * Hook to update product stock
 */
export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      productService.updateStock(id, stock),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      toast.success("Stock updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update stock");
    },
  });
}

/**
 * Hook to upload product image
 */
export function useUploadProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, productId }: { file: File; productId: string }) =>
      productService.uploadImage(file, productId),
    onSuccess: (url, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: PRODUCT_KEYS.detail(variables.productId) 
      });
      toast.success("Image uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload image");
    },
  });
}

/**
 * Hook to delete product image
 */
export function useDeleteProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, productId }: { imageId: string; productId: string }) =>
      productService.deleteImage(imageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: PRODUCT_KEYS.detail(variables.productId) 
      });
      toast.success("Image deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete image");
    },
  });
}
