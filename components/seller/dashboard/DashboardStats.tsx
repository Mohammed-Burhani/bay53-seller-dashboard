"use client";

import { Card, CardContent } from "@/components/seller/ui/Card";
import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

interface DashboardStatsProps {
  stats: Stat[];
  isLoading?: boolean;
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                {stat.trend && (
                  <p
                    className={`text-xs mt-2 flex items-center gap-1 ${
                      stat.trend.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend.isPositive ? "↑" : "↓"} {Math.abs(stat.trend.value)}%
                    <span className="text-gray-500">vs last month</span>
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Predefined stat configurations
export const createDefaultStats = (data: {
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  revenue?: number;
}) => {
  return [
    {
      label: "Total Products",
      value: data.totalProducts,
      icon: <Package className="h-5 w-5 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      label: "Active Products",
      value: data.activeProducts,
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      color: "bg-green-50",
    },
    {
      label: "Low Stock Alerts",
      value: data.lowStockCount,
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      color: "bg-red-50",
    },
    {
      label: "Revenue",
      value: data.revenue ? `₹${data.revenue.toLocaleString()}` : "₹0",
      icon: <DollarSign className="h-5 w-5 text-purple-600" />,
      color: "bg-purple-50",
    },
  ];
};
