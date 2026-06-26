import { useQuery } from "@tanstack/react-query";
import { delay } from "@/lib/utils/helpers";
import {
  mockDashboardStats,
  mockOrders,
  mockOrdersByStatus,
  mockProducts,
  mockRevenueByDay,
  mockTopProducts,
  mockBadgeCounts,
  mockSeller,
} from "@/lib/mock/data";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  revenue: (days: number) => [...dashboardKeys.all, "revenue", days] as const,
  ordersByStatus: () => [...dashboardKeys.all, "ordersByStatus"] as const,
  topProducts: () => [...dashboardKeys.all, "topProducts"] as const,
  badges: () => [...dashboardKeys.all, "badges"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      await delay(400);
      return mockDashboardStats;
    },
    staleTime: 30 * 1000,
  });
}

export function useRevenueChart(days = 30) {
  return useQuery({
    queryKey: dashboardKeys.revenue(days),
    queryFn: async () => {
      await delay(300);
      return mockRevenueByDay.slice(-days);
    },
  });
}

export function useOrdersByStatus() {
  return useQuery({
    queryKey: dashboardKeys.ordersByStatus(),
    queryFn: async () => {
      await delay(300);
      return mockOrdersByStatus;
    },
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: dashboardKeys.topProducts(),
    queryFn: async () => {
      await delay(300);
      return mockTopProducts;
    },
  });
}

export function useBadgeCounts() {
  return useQuery({
    queryKey: dashboardKeys.badges(),
    queryFn: async () => {
      await delay(200);
      return mockBadgeCounts;
    },
    staleTime: 30 * 1000,
  });
}

export function useSeller() {
  return useQuery({
    queryKey: ["seller"],
    queryFn: async () => {
      await delay(200);
      return mockSeller;
    },
    staleTime: 60 * 1000,
  });
}

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: Record<string, string>) => [...productKeys.lists(), filters] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

export function useProducts(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      await delay(400);
      let data = [...mockProducts];
      if (filters.search) {
        const q = filters.search.toLowerCase();
        data = data.filter(
          (p) => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
        );
      }
      if (filters.status) data = data.filter((p) => p.status === filters.status);
      return { data, total: data.length };
    },
    placeholderData: (prev) => prev,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      await delay(300);
      const product = mockProducts.find((p) => p.id === id);
      if (!product) throw new Error("Product not found");
      return product;
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: Record<string, string>) => [...orderKeys.lists(), filters] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

export function useOrders(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: async () => {
      await delay(400);
      let data = [...mockOrders];
      if (filters.status) data = data.filter((o) => o.status === filters.status);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        data = data.filter(
          (o) =>
            o.order_number.toLowerCase().includes(q) ||
            o.customer_name.toLowerCase().includes(q),
        );
      }
      return { data, total: data.length };
    },
    placeholderData: (prev) => prev,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      await delay(300);
      const order = mockOrders.find((o) => o.id === id);
      if (!order) throw new Error("Order not found");
      return order;
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}
