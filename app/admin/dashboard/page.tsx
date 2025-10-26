"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Package, CheckCircle, DollarSign, TrendingUp } from "lucide-react";
import { apiService } from "@/lib/apiService";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { formatCurrency, getMonthName, formatDate } from "@/lib/utils";
import Header from "@/components/Header";

// TypeScript types to match backend
interface StatusStat {
  _id: string;
  count: number;
}

interface CategoryStat {
  category: string;
  count: number;
  totalRevenue: number;
}

interface MonthlyStat {
  _id: { year: number; month: number };
  count: number;
  revenue: number;
}

interface Subscription {
  _id: string;
  user: { name: string; email: string };
  product: { name: string; price: number; category: { name: string } };
  priceAtSubscription: number;
  status: string;
  createdAt: string;
}

interface AdminStats {
  totalSubscriptions: number;
  statusStats: StatusStat[];
  totalRevenue: number;
  avgPrice: number;
  categoryStats: CategoryStat[];
  monthlyStats: MonthlyStat[];
}

interface AdminDashboardResponse {
  success: boolean;
  message: string;
  stats: AdminStats;
  recentSubscriptions: Subscription[];
}

// Chart colors
const COLORS: Record<string, string> = {
  active: "#10b981",
  cancelled: "#ef4444",
  expired: "#f59e0b",
  other: "#64748b",
};

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/admin/dashboard");
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error && !data) return <p className="text-center">{error}</p>;
  if (!data) return null;

  const { stats, recentSubscriptions } = data;

  // Prepare data for charts
  const statusData = stats.statusStats.map((s) => ({
    name: s._id,
    value: s.count,
  }));

  const categoryData = stats.categoryStats.map((c) => ({
    name: c.category,
    revenue: c.totalRevenue,
    count: c.count,
  }));

  const monthlyData = stats.monthlyStats.map((m) => ({
    month: `${getMonthName(m._id.month)} ${m._id.year}`,
    revenue: m.revenue,
    count: m.count,
  }));

  const filteredSubs = selectedStatus
    ? recentSubscriptions.filter((sub) => sub.status === selectedStatus)
    : recentSubscriptions;

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <Header
        title="Admin Dashboard"
        subtitle="Overview of all subscriptions"
        onRefresh={fetchDashboardData}
        stats={[
          {
            title: "Total Subscriptions",
            value: stats.totalSubscriptions,
            icon: <Package className="w-6 h-6 text-blue-600" />,
          },
          {
            title: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            icon: <DollarSign className="w-6 h-6 text-green-600" />,
            trend: { value: "+12.5%", isPositive: true },
          },
          {
            title: "Average Price",
            value: formatCurrency(Math.round(stats.avgPrice)),
            icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
          },
          {
            title: "Active Subscriptions",
            value:
              stats.statusStats.find((s) => s._id === "active")?.count || 0,
            icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
          },
        ]}
      />
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[entry.name] || COLORS.other} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Category">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(val: number) => formatCurrency(val)} />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      {/* Monthly trend */}
      <ChartCard title="Monthly Revenue Trend">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(val: number) => formatCurrency(val)} />
            <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      {/* Recent Subscriptions */}
      <div className="bg-muted border border-border rounded-2xl p-6 mt-10">
        <h2 className="text-xl font-bold text-primary mb-4">
          Recent Subscriptions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left text-accent">Product</th>
                <th className="py-3 px-4 text-left text-accent">User</th>
                <th className="py-3 px-4 text-left text-accent">Category</th>
                <th className="py-3 px-4 text-left text-accent">Price</th>
                <th className="py-3 px-4 text-left text-accent">Status</th>
                <th className="py-3 px-4 text-left text-accent">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.map((sub) => (
                <tr key={sub._id} className="border-b border-border">
                  <td className="py-3 px-4 text-primary">{sub.product.name}</td>
                  <td className="py-3 px-4 text-secondary">
                    {sub.user.name} <br />
                    <span className="text-xs">{sub.user.email}</span>
                  </td>
                  <td className="py-3 px-4 capitalize">
                    {sub.product.category.name}
                  </td>
                  <td className="py-3 px-4 font-semibold text-primary">
                    {formatCurrency(sub.priceAtSubscription)}
                  </td>
                  <td className="py-3 px-4 capitalize">{sub.status}</td>
                  <td className="py-3 px-4">{formatDate(sub.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Reusable components

const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-muted border border-border rounded-2xl p-6">
    <h2 className="text-xl font-bold text-primary mb-4">{title}</h2>
    {children}
  </div>
);
