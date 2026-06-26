"use client";

import Link from "next/link";
import { useNotifications } from "@/lib/queries/useModules";
import { useTableFilters } from "@/lib/hooks/useTableFilters";
import { QueryError, QueryLoading } from "@/components/seller/ui/QueryState";
import { formatRelative } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/helpers";
import {
  Bell,
  Briefcase,
  RefreshCcw,
  ShoppingCart,
  Star,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { NotificationRow } from "@/lib/mock/modules";

const DEFAULTS = { type: "" };

const ICONS: Record<string, LucideIcon> = {
  order: ShoppingCart,
  return: RefreshCcw,
  payment: Wallet,
  review: Star,
  rfq: Briefcase,
  system: Bell,
};

function groupByDate(items: NotificationRow[]) {
  const groups: Record<string, NotificationRow[]> = {};
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();

  for (const item of items) {
    const d = new Date(item.created_at).toDateString();
    let label = "Earlier";
    if (d === today) label = "Today";
    else if (d === yesterday) label = "Yesterday";
    else if (now.getTime() - new Date(item.created_at).getTime() < 7 * 86400000) label = "This week";
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  }
  return groups;
}

export default function NotificationsPage() {
  const { filters, setFilter } = useTableFilters(DEFAULTS);
  const { data, isLoading, isError, refetch } = useNotifications(filters);

  const groups = data?.data ? groupByDate(data.data) : {};

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Notifications</h1>
        <button type="button" className="text-sm text-primary hover:underline">Mark all as read</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["", "order", "payment", "review", "rfq", "return"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter("type", t)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize",
              filters.type === t ? "bg-primary text-white" : "bg-gray-100 text-text-secondary",
            )}
          >
            {t || "All"}
          </button>
        ))}
      </div>

      {isLoading && <QueryLoading />}
      {isError && <QueryError onRetry={() => refetch()} />}

      {!isLoading && !isError && Object.entries(groups).map(([label, items]) => (
        <section key={label}>
          <h2 className="mb-2 text-sm font-semibold text-text-secondary">{label}</h2>
          <ul className="space-y-1">
            {items.map((n) => {
              const Icon = ICONS[n.type] ?? Bell;
              return (
                <li key={n.id}>
                  <Link
                    href={n.link}
                    className={cn(
                      "flex items-start gap-3 rounded-[8px] px-3 py-3 transition-colors hover:bg-surface",
                      !n.read && "bg-primary/5",
                    )}
                  >
                    {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-sm", !n.read && "font-semibold")}>{n.title}</p>
                      <p className="text-xs text-text-secondary">{n.detail}</p>
                    </div>
                    <span className="text-xs text-text-muted shrink-0">{formatRelative(n.created_at)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
