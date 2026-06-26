"use client";

import { use } from "react";
import { useOrder } from "@/lib/queries/useDashboard";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import { Card, CardContent, CardHeader } from "@/components/seller/ui/Card";
import { Button } from "@/components/seller/ui/Button";
import { Skeleton } from "@/components/seller/ui/Skeleton";
import { formatCurrency, formatDateTime } from "@/lib/utils/formatters";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading, isError, refetch } = useOrder(id);

  if (isLoading) return <Skeleton className="h-64" />;
  if (isError || !order) {
    return (
      <div className="text-center">
        <p className="text-text-secondary">Order not found.</p>
        <Button className="mt-2" onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[70%_30%]">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-mono">{order.order_number}</h1>
          <StatusBadge status={order.status} />
        </div>
        <Card>
          <CardHeader><h2 className="text-sm font-semibold">Order Items</h2></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Commission</span><span>-{formatCurrency(order.commission)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>GST</span><span>{formatCurrency(order.gst)}</span>
            </div>
            <div className="flex justify-between font-semibold text-success">
              <span>Net earnings</span><span>{formatCurrency(order.net_earnings)}</span>
            </div>
          </CardContent>
        </Card>
        {order.status === "new" && (
          <div className="flex gap-2">
            <Button>Confirm Order</Button>
            <Button variant="ghost">Cancel Order</Button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader><h2 className="text-sm font-semibold">Customer</h2></CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{order.customer_name}</p>
            <p className="text-text-secondary">{order.customer_city}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h2 className="text-sm font-semibold">Payment</h2></CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="capitalize">{order.payment_method.replace("_", " ")}</p>
            <p className="font-medium">{formatCurrency(order.total_amount)}</p>
            <p className="text-text-secondary">{formatDateTime(order.placed_at)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
