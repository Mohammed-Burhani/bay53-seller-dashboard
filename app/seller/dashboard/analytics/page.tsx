"use client";

import { useAnalytics } from "@/lib/queries/useModules";
import { useRevenueChart } from "@/lib/queries/useDashboard";
import { QueryError, QueryLoading } from "@/components/seller/ui/QueryState";
import { formatCurrency } from "@/lib/utils/formatters";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils/helpers";

function KpiCard({ label, value, change, format }: { label: string; value: number; change: number; format?: "currency" | "number" | "pct" }) {
  const display =
    format === "currency" ? formatCurrency(value) :
    format === "pct" ? `${value}%` : value.toLocaleString("en-IN");
  const up = change >= 0;

  return (
    <div className="rounded-[8px] border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-bold">{display}</p>
      <p className={cn("mt-1 flex items-center gap-1 text-xs font-medium", up ? "text-success" : "text-destructive")}>
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(change)}% vs prior period
      </p>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: kpis, isLoading, isError, refetch } = useAnalytics();
  const { data: revenue } = useRevenueChart(30);

  const orderVolume = revenue?.map((d) => ({
    date: new Date(d.date).getDate(),
    delivered: Math.floor(Math.random() * 8) + 2,
    cancelled: Math.floor(Math.random() * 2),
  })) ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Analytics</h1>
        <div className="flex gap-1 rounded-[6px] border border-border bg-card p-1 text-xs">
          {["7d", "30d", "90d", "Year"].map((p) => (
            <button key={p} type="button" className="rounded-[4px] px-3 py-1 font-medium text-text-secondary hover:bg-surface">
              {p}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <QueryLoading rows={2} />}
      {isError && <QueryError onRetry={() => refetch()} />}

      {kpis && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard label="Revenue" value={kpis.revenue} change={kpis.revenueChange} format="currency" />
          <KpiCard label="Orders" value={kpis.orders} change={kpis.ordersChange} />
          <KpiCard label="Avg order value" value={kpis.aov} change={kpis.aovChange} format="currency" />
          <KpiCard label="Units sold" value={kpis.unitsSold} change={kpis.unitsChange} />
          <KpiCard label="Return rate" value={kpis.returnRate} change={kpis.returnRateChange} format="pct" />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[8px] border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Revenue trend</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue ?? []}>
                <XAxis dataKey="date" tickFormatter={(d) => new Date(d).getDate().toString()} fontSize={11} />
                <YAxis tickFormatter={(v) => `₹${(Number(v) / 1000).toFixed(0)}k`} fontSize={11} />
                <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))} />
                <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-[8px] border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Order volume by status</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderVolume}>
                <XAxis dataKey="date" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="delivered" stackId="a" fill="#10B981" />
                <Bar dataKey="cancelled" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
