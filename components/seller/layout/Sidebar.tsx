"use client";

import {
  BarChart2,
  Bell,
  Briefcase,
  ExternalLink,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Package,
  RefreshCcw,
  Settings2,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  Users,
  Wallet,
  Warehouse,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";
import { useBadgeCounts, useSeller } from "@/lib/queries/useDashboard";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils/helpers";

interface SidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ collapsed, onNavigate }: SidebarProps) {
  const { data: badges } = useBadgeCounts();
  const { data: seller } = useSeller();

  const linkProps = { collapsed, onClick: onNavigate };

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-sidebar-bg",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center border-b border-border px-4">
        {!collapsed && (
          <span className="text-sm font-bold text-text-primary">Fast Tools</span>
        )}
        {collapsed && <span className="text-sm font-bold text-primary">FT</span>}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <SidebarSection title="Main" collapsed={collapsed}>
          <SidebarItem href="/seller/dashboard" icon={LayoutDashboard} label="Dashboard" {...linkProps} />
          <SidebarItem href="/seller/dashboard/analytics" icon={BarChart2} label="Analytics" {...linkProps} />
        </SidebarSection>
        <SidebarSection title="Catalog" collapsed={collapsed}>
          <SidebarItem href="/seller/dashboard/products" icon={Package} label="Products" {...linkProps} />
          <SidebarItem href="/seller/dashboard/inventory" icon={Warehouse} label="Inventory" {...linkProps} />
        </SidebarSection>
        <SidebarSection title="Operations" collapsed={collapsed}>
          <SidebarItem
            href="/seller/dashboard/orders"
            icon={ShoppingCart}
            label="Orders"
            badge={badges?.unconfirmedOrders}
            {...linkProps}
          />
          <SidebarItem
            href="/seller/dashboard/returns"
            icon={RefreshCcw}
            label="Returns"
            badge={badges?.pendingReturns}
            {...linkProps}
          />
          <SidebarItem href="/seller/dashboard/shipping" icon={Truck} label="Shipping" {...linkProps} />
        </SidebarSection>
        <SidebarSection title="Business" collapsed={collapsed}>
          <SidebarItem href="/seller/dashboard/payments" icon={Wallet} label="Payments" {...linkProps} />
          <SidebarItem href="/seller/dashboard/promotions" icon={Tag} label="Promotions" {...linkProps} />
          <SidebarItem href="/seller/dashboard/b2b" icon={Briefcase} label="B2B / RFQ" {...linkProps} />
          <SidebarItem href="/seller/dashboard/customers" icon={Users} label="Customers" {...linkProps} />
        </SidebarSection>
        <SidebarSection title="Engagement" collapsed={collapsed}>
          <SidebarItem href="/seller/dashboard/reviews" icon={Star} label="Reviews" {...linkProps} />
          <SidebarItem
            href="/seller/dashboard/notifications"
            icon={Bell}
            label="Notifications"
            badge={badges?.unreadNotifications}
            {...linkProps}
          />
          <SidebarItem href="/seller/dashboard/support" icon={HelpCircle} label="Support" {...linkProps} />
        </SidebarSection>
        <SidebarSection title="Account" collapsed={collapsed}>
          <SidebarItem href="/seller/dashboard/settings" icon={Settings2} label="Settings" {...linkProps} />
        </SidebarSection>
      </nav>

      {!collapsed && (
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
              {seller?.store_name?.charAt(0) ?? "S"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">
                {seller?.store_name ?? "Store"}
              </p>
              <a
                href="https://getfasttools.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View Storefront <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-2 w-full justify-start text-text-secondary">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      )}
    </aside>
  );
}
