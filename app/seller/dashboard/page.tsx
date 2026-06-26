"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/seller/ui/StatsCard";
import { Card, CardContent, CardHeader } from "@/components/seller/ui/Card";
import { Skeleton } from "@/components/seller/ui/Skeleton";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import { Button } from "@/components/seller/ui/Button";
import {
  useDashboardStats,
  useOrdersByStatus,
  useRevenueChart,
  useTopProducts,
} from "@/lib/queries/useDashboard";
import { useOrders } from "@/lib/queries/useDashboard";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardPage() {
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();
  const { data: revenue } = useRevenueChart(30);
  const { data: orderStatus } = useOrdersByStatus();
  const { data: topProducts } = useTopProducts();
  const { data: recentOrders } = useOrders({});

  if (isError) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <h2 className="mt-2 font-semibold">Something went wrong</h2>
        <p className="text-sm text-text-secondary">We couldn&apos;t load dashboard data.</p>
        <Button className="mt-4" onClick={() => refetch()}>Try again</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">Overview</h1>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Total Revenue"
            value={stats!.revenueThisMonth}
            change={stats!.revenueChange}
            sparkline={stats!.revenueSparkline}
            format="currency"
          />
          <StatsCard
            label="Total Orders"
            value={stats!.ordersThisMonth}
            change={stats!.ordersChange}
            sparkline={stats!.ordersSparkline}
          />
          <StatsCard
            label="Active Listings"
            value={stats!.activeListings}
            change={stats!.listingsChange}
          />
          <StatsCard
            label="Pending Actions"
            value={stats!.pendingActions}
            change={stats!.pendingActionsChange}
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[65%_35%]">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold">Revenue (30 days)</h2>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenue ?? []}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => new Date(d).getDate().toString()}
                    fontSize={12}
                  />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} fontSize={12} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))} />
                  <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold">Orders by Status</h2>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatus ?? []}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={50}
                    outerRadius={70}
                  >
                    {(orderStatus ?? []).map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1">
              {(orderStatus ?? []).map((s) => (
                <div key={s.status} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    {s.status}
                  </span>
                  <span className="font-medium">{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold">Recent Orders</h2>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <tbody>
                {(recentOrders?.data ?? []).slice(0, 5).map((o, i) => (
                  <tr key={o.id} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-3 font-mono text-text-secondary">{o.order_number}</td>
                    <td className="px-4 py-3">{o.customer_name}</td>
                    <td className="px-4 py-3">{formatCurrency(o.total_amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-text-secondary">{formatDate(o.placed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-border px-4 py-2">
              <Link href="/seller/dashboard/orders" className="text-sm text-primary hover:underline">
                View all orders →
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold">Pending Actions</h2>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/seller/dashboard/orders?status=new" className="flex justify-between rounded-[6px] px-2 py-2 hover:bg-surface">
              <span className="text-sm">{stats?.unconfirmedOrders ?? 0} orders waiting confirmation</span>
            </Link>
            <Link href="/seller/dashboard/returns" className="flex justify-between rounded-[6px] px-2 py-2 hover:bg-surface">
              <span className="text-sm">{stats?.pendingReturns ?? 0} return requests</span>
            </Link>
            <Link href="/seller/dashboard/b2b" className="flex justify-between rounded-[6px] px-2 py-2 hover:bg-surface">
              <span className="text-sm">{stats?.unansweredRfqs ?? 0} unanswered RFQs</span>
            </Link>
            <Link href="/seller/dashboard/inventory" className="flex justify-between rounded-[6px] px-2 py-2 hover:bg-surface">
              <span className="text-sm">{stats?.zeroStockProducts ?? 0} products with zero stock</span>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold">Top Products This Month</h2>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts ?? []} layout="vertical">
                <XAxis type="number" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} fontSize={12} />
                <YAxis type="category" dataKey="name" width={140} fontSize={11} />
                <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))} />
                <Bar dataKey="revenue" fill="#2563EB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
