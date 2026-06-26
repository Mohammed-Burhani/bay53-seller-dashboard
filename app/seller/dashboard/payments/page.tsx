"use client";

import { useState } from "react";
import Link from "next/link";
import { usePaymentSummary, useTransactions, usePayouts } from "@/lib/queries/useModules";
import { QueryError, QueryLoading } from "@/components/seller/ui/QueryState";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/helpers";

const TABS = ["overview", "transactions", "payouts"] as const;

export default function PaymentsPage() {
  const [tab, setTab] = useState<typeof TABS[number]>("overview");
  const summary = usePaymentSummary();
  const transactions = useTransactions();
  const payouts = usePayouts();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">Payments</h1>

      <div className="flex gap-1 rounded-[8px] border border-border bg-card p-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-[6px] px-3 py-2 text-sm font-medium capitalize",
              tab === t ? "bg-primary text-white" : "text-text-secondary hover:bg-surface",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          {summary.isLoading && <QueryLoading rows={2} />}
          {summary.isError && <QueryError onRetry={() => summary.refetch()} />}
          {summary.data && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[8px] border-2 border-primary bg-primary/5 p-4">
                <p className="text-xs font-medium uppercase text-text-secondary">Payout balance</p>
                <p className="mt-1 text-3xl font-bold text-primary">{formatCurrency(summary.data.payoutBalance)}</p>
              </div>
              <div className="rounded-[8px] border border-border bg-card p-4">
                <p className="text-xs font-medium uppercase text-text-secondary">Last payout</p>
                <p className="mt-1 text-xl font-bold">{formatCurrency(summary.data.lastPayout)}</p>
                <p className="text-xs text-text-muted">{formatDate(summary.data.lastPayoutDate)}</p>
              </div>
              <div className="rounded-[8px] border border-border bg-card p-4">
                <p className="text-xs font-medium uppercase text-text-secondary">Total earnings</p>
                <p className="mt-1 text-xl font-bold">{formatCurrency(summary.data.totalEarnings)}</p>
              </div>
              <div className="rounded-[8px] border border-border bg-card p-4">
                <p className="text-xs font-medium uppercase text-text-secondary">Commission paid</p>
                <p className="mt-1 text-xl font-bold text-text-secondary">{formatCurrency(summary.data.totalCommission)}</p>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "transactions" && (
        <div className="rounded-[8px] border border-border bg-card">
          {transactions.isLoading && <QueryLoading />}
          {transactions.isError && <QueryError onRetry={() => transactions.refetch()} />}
          {transactions.data && (
            <ul>
              {transactions.data.map((t, i) => (
                <li
                  key={t.id}
                  className={cn(
                    "flex flex-wrap items-center gap-3 px-4 py-3 text-sm",
                    i % 2 === 1 && "bg-gray-50",
                  )}
                >
                  <span className="w-24 text-xs text-text-muted">{formatDate(t.date)}</span>
                  <span className="w-28 capitalize font-medium">{t.type.replace("_", " ")}</span>
                  {t.order_number && (
                    <Link href={`/seller/dashboard/orders/${t.order_id}`} className="font-mono text-primary hover:underline">
                      {t.order_number}
                    </Link>
                  )}
                  <span className="flex-1 text-right font-medium">{formatCurrency(t.gross)}</span>
                  <span className="text-destructive">-{formatCurrency(t.deductions)}</span>
                  <span className="w-24 text-right font-semibold">{formatCurrency(t.net)}</span>
                  <span className="w-24 text-right text-xs text-text-muted">Bal {formatCurrency(t.balance)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "payouts" && (
        <div className="space-y-3">
          {payouts.isLoading && <QueryLoading />}
          {payouts.isError && <QueryError onRetry={() => payouts.refetch()} />}
          {payouts.data?.map((p) => (
            <div key={p.id} className="rounded-[8px] border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{p.period}</p>
                  <p className="text-xs text-text-muted">{p.orders_count} orders · {p.bank_masked}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-text-muted">Gross</p>
                  <p className="font-medium">{formatCurrency(p.gross)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Deductions</p>
                  <p className="font-medium text-destructive">-{formatCurrency(p.deductions)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Net payout</p>
                  <p className="font-bold text-success">{formatCurrency(p.net)}</p>
                </div>
              </div>
              {p.payout_date && <p className="mt-2 text-xs text-text-muted">Paid {formatDate(p.payout_date)}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
