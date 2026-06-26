import { cn } from "@/lib/utils/helpers";
import { formatCurrency } from "@/lib/utils/formatters";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface StatsCardProps {
  label: string;
  value: number | string;
  change?: number;
  sparkline?: number[];
  format?: "currency" | "number";
}

export function StatsCard({ label, value, change, sparkline, format = "number" }: StatsCardProps) {
  const displayValue =
    format === "currency" && typeof value === "number" ? formatCurrency(value) : value;
  const isPositive = change !== undefined && change >= 0;
  const chartData = sparkline?.map((v, i) => ({ i, v })) ?? [];

  return (
    <div className="rounded-[8px] border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-text-primary">{displayValue}</p>
      {change !== undefined && (
        <div className={cn("mt-1 flex items-center gap-1 text-xs font-medium", isPositive ? "text-success" : "text-destructive")}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(change)}% vs last month
        </div>
      )}
      {sparkline && sparkline.length > 0 && (
        <div className="mt-3 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
