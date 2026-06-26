import { useQuery } from "@tanstack/react-query";
import { delay } from "@/lib/utils/helpers";
import {
  mockInventory,
  mockReturns,
  mockShipments,
  mockTransactions,
  mockPayouts,
  mockPromotions,
  mockRfqs,
  mockCustomers,
  mockReviews,
  mockNotifications,
  mockSupportTickets,
  mockBulkUploads,
  mockAnalyticsKpis,
  mockRatingDistribution,
  mockPaymentSummary,
  SETTINGS_SECTIONS,
} from "@/lib/mock/modules";

export function useInventory(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["inventory", filters],
    queryFn: async () => {
      await delay(350);
      let data = [...mockInventory];
      if (filters.stock === "low") data = data.filter((i) => i.stock > 0 && i.stock <= i.threshold);
      if (filters.stock === "out") data = data.filter((i) => i.stock === 0);
      if (filters.stock === "in") data = data.filter((i) => i.stock > i.threshold);
      return { data, total: data.length };
    },
    placeholderData: (p) => p,
  });
}

export function useReturns(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["returns", filters],
    queryFn: async () => {
      await delay(350);
      let data = [...mockReturns];
      if (filters.status) data = data.filter((r) => r.status === filters.status);
      return { data, total: data.length };
    },
    placeholderData: (p) => p,
  });
}

export function useShipments(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["shipments", filters],
    queryFn: async () => {
      await delay(350);
      let data = [...mockShipments];
      if (filters.status) data = data.filter((s) => s.status === filters.status);
      return { data, total: data.length };
    },
    placeholderData: (p) => p,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      await delay(350);
      return mockTransactions;
    },
  });
}

export function usePayouts() {
  return useQuery({
    queryKey: ["payouts"],
    queryFn: async () => {
      await delay(300);
      return mockPayouts;
    },
  });
}

export function usePaymentSummary() {
  return useQuery({
    queryKey: ["payment-summary"],
    queryFn: async () => {
      await delay(300);
      return mockPaymentSummary;
    },
  });
}

export function usePromotions(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["promotions", filters],
    queryFn: async () => {
      await delay(350);
      let data = [...mockPromotions];
      if (filters.status) data = data.filter((p) => p.status === filters.status);
      return { data, total: data.length };
    },
    placeholderData: (p) => p,
  });
}

export function useRfqs(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["rfqs", filters],
    queryFn: async () => {
      await delay(350);
      let data = [...mockRfqs];
      if (filters.status) data = data.filter((r) => r.status === filters.status);
      return { data, total: data.length };
    },
    placeholderData: (p) => p,
  });
}

export function useCustomers(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["customers", filters],
    queryFn: async () => {
      await delay(350);
      let data = [...mockCustomers];
      if (filters.type) data = data.filter((c) => c.buyer_type === filters.type);
      if (filters.status) data = data.filter((c) => c.status === filters.status);
      return { data, total: data.length };
    },
    placeholderData: (p) => p,
  });
}

export function useReviews(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["reviews", filters],
    queryFn: async () => {
      await delay(350);
      let data = [...mockReviews];
      if (filters.responded === "yes") data = data.filter((r) => r.responded);
      if (filters.responded === "no") data = data.filter((r) => !r.responded);
      return { data, total: data.length, distribution: mockRatingDistribution };
    },
    placeholderData: (p) => p,
  });
}

export function useNotifications(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: async () => {
      await delay(300);
      let data = [...mockNotifications];
      if (filters.type) data = data.filter((n) => n.type === filters.type);
      return { data, total: data.length };
    },
    placeholderData: (p) => p,
  });
}

export function useSupportTickets(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["support", filters],
    queryFn: async () => {
      await delay(350);
      let data = [...mockSupportTickets];
      if (filters.status) data = data.filter((t) => t.status === filters.status);
      return { data, total: data.length };
    },
    placeholderData: (p) => p,
  });
}

export function useBulkUploads() {
  return useQuery({
    queryKey: ["bulk-uploads"],
    queryFn: async () => {
      await delay(300);
      return mockBulkUploads;
    },
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      await delay(400);
      return mockAnalyticsKpis;
    },
  });
}

export function useSettingsSections() {
  return useQuery({
    queryKey: ["settings-sections"],
    queryFn: async () => {
      await delay(200);
      return SETTINGS_SECTIONS;
    },
  });
}
