"use client";

import { DashboardShell } from "@/components/seller/layout/DashboardShell";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Products",
  inventory: "Inventory",
  orders: "Orders",
  returns: "Returns",
  shipping: "Shipping",
  payments: "Payments",
  promotions: "Promotions",
  b2b: "B2B / RFQ",
  customers: "Customers",
  reviews: "Reviews",
  notifications: "Notifications",
  support: "Support",
  settings: "Settings",
  analytics: "Analytics",
  new: "New",
  "bulk-upload": "Bulk Upload",
};

function buildBreadcrumbs(pathname: string) {
  const parts = pathname.replace("/seller/dashboard", "").split("/").filter(Boolean);
  const items: { label: string; href?: string }[] = [
    { label: "Dashboard", href: "/seller/dashboard" },
  ];
  let path = "/seller/dashboard";
  for (const part of parts) {
    path += `/${part}`;
    const label = LABELS[part] ?? part;
    items.push({ label, href: path });
  }
  if (items.length > 1) {
    const last = items[items.length - 1];
    items[items.length - 1] = { label: last.label };
  }
  return items;
}

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);
  return <DashboardShell breadcrumbs={breadcrumbs}>{children}</DashboardShell>;
}
