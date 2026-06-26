"use client";

import Link from "next/link";
import { useSupportTickets } from "@/lib/queries/useModules";
import { useTableFilters } from "@/lib/hooks/useTableFilters";
import { QueryError, QueryLoading } from "@/components/seller/ui/QueryState";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import { formatRelative } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/helpers";
import { HelpCircle, BookOpen, FileText } from "lucide-react";

const DEFAULTS = { status: "" };

const PRIORITY_STYLES = {
  low: "border-t-4 border-t-gray-300",
  medium: "border-t-4 border-t-primary",
  high: "border-t-4 border-t-warning",
  urgent: "border-t-4 border-t-destructive",
};

export default function SupportPage() {
  const { filters, setFilter } = useTableFilters(DEFAULTS);
  const { data, isLoading, isError, refetch } = useSupportTickets(filters);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">Support</h1>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: BookOpen, label: "Help Centre", href: "https://getfasttools.vercel.app/help" },
          { icon: FileText, label: "Seller FAQs", href: "https://getfasttools.vercel.app/seller-faq" },
          { icon: HelpCircle, label: "Commission Schedule", href: "/seller/dashboard/payments" },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex items-center gap-3 rounded-[8px] border border-border bg-card p-4 hover:bg-surface"
          >
            <card.icon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{card.label}</span>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {["", "open", "in_progress", "awaiting_seller", "resolved"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter("status", s)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize",
              filters.status === s ? "bg-primary text-white" : "bg-gray-100 text-text-secondary",
            )}
          >
            {s ? s.replace("_", " ") : "All"}
          </button>
        ))}
      </div>

      {isLoading && <QueryLoading />}
      {isError && <QueryError onRetry={() => refetch()} />}

      {!isLoading && !isError && data && (
        <div className="grid gap-3 md:grid-cols-2">
          {data.data.map((t) => (
            <Link
              key={t.id}
              href={`/seller/dashboard/support/${t.id}`}
              className={cn(
                "rounded-[8px] border border-border bg-card p-4 transition-colors hover:bg-surface",
                PRIORITY_STYLES[t.priority],
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-mono text-xs text-text-muted">{t.ticket_number}</p>
                <StatusBadge status={t.status.replace("_", " ")} />
              </div>
              <p className="mt-2 font-medium text-text-primary">{t.subject}</p>
              <p className="mt-1 text-sm text-text-secondary line-clamp-2">{t.message_preview}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                <span className="capitalize">{t.category}</span>
                <span>·</span>
                <span className="capitalize font-medium text-text-secondary">{t.priority}</span>
                {t.assigned_to && <span>· {t.assigned_to}</span>}
                <span className="ml-auto">{formatRelative(t.updated_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
