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
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Workflow,
} from "lucide-react";
import { apiService } from "@/lib/apiService";
import Loader from "@/components/Loader";
import { formatCurrency, formatDate, getMonthName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ManageModal from "@/components/modals/UserManageModal";

// TypeScript Types
type SubscriptionStatus = "active" | "cancelled" | "expired";
type SubscriptionFrequency = "monthly" | "yearly" | "weekly";
type SubscriptionCategory =
  | "music"
  | "news"
  | "movies"
  | "streaming"
  | "gaming"
  | "productivity"
  | "fitness"
  | "sports"
  | "other";
type Currency = "NGN" | "USD" | "EUR" | "GBP";
type PaymentMethod = "paystack" | "stripe" | "paypal" | "bank_transfer";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface StatusStat {
  _id: SubscriptionStatus;
  count: number;
}

interface CategoryStat {
  count: number;
  totalRevenue: number;
  category: SubscriptionCategory;
}

interface MonthlyStat {
  _id: {
    year: number;
    month: number;
  };
  count: number;
  revenue: number;
}

interface AdminStats {
  totalSubscriptions: number;
  statusStats: StatusStat[];
  totalRevenue: number;
  avgPrice: number;
  categoryStats: CategoryStat[];
  monthlyStats: MonthlyStat[];
}

interface Subscription {
  _id: string;
  name: string;
  price: number;
  currency: Currency;
  frequency: SubscriptionFrequency;
  category: SubscriptionCategory;
  status: SubscriptionStatus;
  cancelledAt: string | null;
  paymentMethod: PaymentMethod;
  startDate: string;
  renewalDate: string;
  reminders: string[];
  reminderSent: boolean;
  user: User;
  reminderDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  cancelReason?: string;
}

interface AdminDashboardResponse {
  success: boolean;
  message: string;
  stats: AdminStats;
  recentSubscriptions: Subscription[];
}

const COLORS = {
  active: "#10b981",
  cancelled: "#ef4444",
  expired: "#f59e0b",
  music: "#8b5cf6",
  news: "#ec4899",
  movies: "#f59e0b",
  sports: "#06b6d4",
  streaming: "#14b8a6",
  gaming: "#10b981",
  productivity: "#6366f1",
  fitness: "#ef4444",
  other: "#64748b",
};

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.get("/admin/dashboard");
      console.log("res", response);

      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error && !data) {
    return (
      <h2 className="text-xl font-bold text-muted mb-2 text-center">
        Error Loading Dashboard
      </h2>
    );
  }

  if (!data) return null;

  const statusData = data.stats.statusStats.map((stat) => ({
    name: stat._id.charAt(0).toUpperCase() + stat._id.slice(1),
    value: stat.count,
    status: stat._id,
  }));

  const categoryData = data.stats.categoryStats.map((cat) => ({
    name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
    revenue: cat.totalRevenue,
    count: cat.count,
  }));

  const monthlyData = data.stats.monthlyStats.map((stat) => ({
    month: `${getMonthName(stat._id.month)} ${stat._id.year}`,
    revenue: stat.revenue,
    count: stat.count,
  }));

  const filteredSubscriptions = selectedStatus
    ? data.recentSubscriptions.filter((sub) => sub.status === selectedStatus)
    : data.recentSubscriptions;

  const activeCount =
    data.stats.statusStats.find((s) => s._id === "active")?.count || 0;
  const cancelledCount =
    data.stats.statusStats.find((s) => s._id === "cancelled")?.count || 0;
  const expiredCount =
    data.stats.statusStats.find((s) => s._id === "expired")?.count || 0;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-4xl font-bold text-primary mb-2">
              Admin Dashboard
            </h1>
            <p className="text-secondary">
              Overview of all subscriptions and revenue
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchDashboardData}
              className="bg-accent text-primary font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-muted backdrop-blur-lg rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent rounded-xl">
                <Package className="w-6 h-6 text-accent" />
              </div>
            </div>
            <p className="text-accent text-sm mb-1">Total Subscriptions</p>
            <p className="text-3xl font-bold text-primary">
              {data.stats.totalSubscriptions}
            </p>
          </div>

          <div className="bg-muted backdrop-blur-lg rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent rounded-xl">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
            </div>
            <p className="text-accent text-sm mb-1">Active</p>
            <p className="text-3xl font-bold text-primary">{activeCount}</p>
          </div>

          <div className="bg-muted backdrop-blur-lg rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent rounded-xl">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
            <p className="text-accent text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(data.stats.totalRevenue)}
            </p>
          </div>

          <div className="bg-muted backdrop-blur-lg rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent rounded-xl">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
            </div>
            <p className="text-accent text-sm mb-1">Avg Price</p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(Math.round(data.stats.avgPrice))}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution */}
          <div className="bg-muted backdrop-blur-lg rounded-2xl p-6 border border-border">
            <h2 className="text-xl font-bold text-primary mb-6">
              Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.status as keyof typeof COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {statusData.map((stat) => (
                <button
                  key={stat.status}
                  onClick={() =>
                    setSelectedStatus(
                      selectedStatus === stat.status ? null : stat.status
                    )
                  }
                  className={`p-3 rounded-xl transition-all ${
                    selectedStatus === stat.status
                      ? "bg-border border-2 border-border"
                      : "bg-accent hover:bg-secondary border-2 border-transparent"
                  }`}
                >
                  <p className="text-primary font-bold text-2xl">
                    {stat.value}
                  </p>
                  <p className="text-accent text-xs mt-1">{stat.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Category Revenue */}
          <div className="bg-muted backdrop-blur-lg rounded-2xl p-6 border border-border">
            <h2 className="text-xl font-bold text-primary mb-6">
              Revenue by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: "rgba(255,255,255,0.7)" }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: "rgba(255,255,255,0.7)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="bg-muted backdrop-blur-lg rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">
              {selectedStatus
                ? `${
                    selectedStatus.charAt(0).toUpperCase() +
                    selectedStatus.slice(1)
                  } Subscriptions`
                : "Recent Subscriptions"}
            </h2>
            {selectedStatus && (
              <button
                onClick={() => setSelectedStatus(null)}
                className="text-secondary hover:text-primary text-sm transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
          <div className="w-full">
            {/* TABLE (visible on lg and above) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-accent font-semibold">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-accent font-semibold">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-accent font-semibold">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-accent font-semibold">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-accent font-semibold">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-accent font-semibold">
                      Renewal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((sub) => (
                    <tr
                      key={sub._id}
                      className="border-b border-border hover:bg-secondary transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-primary text-sm"
                            style={{
                              backgroundColor:
                                COLORS[sub.category as keyof typeof COLORS] ||
                                COLORS.other,
                            }}
                          >
                            {sub.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-primary font-semibold">
                              {sub.name}
                            </p>
                            <p className="text-secondary text-xs capitalize">
                              {sub.frequency}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-primary text-sm">{sub.user.name}</p>
                        <p className="text-secondary text-xs">
                          {sub.user.email}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-accent capitalize">
                        {sub.category}
                      </td>
                      <td className="py-4 px-4 text-primary font-semibold">
                        {formatCurrency(sub.price)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            sub.status === "active"
                              ? "bg-green-500/20 text-green-300"
                              : sub.status === "cancelled"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-orange-500/20 text-orange-300"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-primary text-sm">
                        {formatDate(sub.renewalDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CARD VIEW (visible below lg) */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSubscriptions.map((sub) => (
                <div
                  key={sub._id}
                  className="bg-secondary border border-border rounded-xl p-4 shadow-md flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-primary text-sm"
                      style={{
                        backgroundColor:
                          COLORS[sub.category as keyof typeof COLORS] ||
                          COLORS.other,
                      }}
                    >
                      {sub.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-primary font-semibold">{sub.name}</p>
                      <p className="text-secondary text-xs capitalize">
                        {sub.frequency}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-sm">
                    <p>
                      <span className="text-accent font-semibold">User:</span>{" "}
                      <span className="text-primary">{sub?.user.name}</span>
                    </p>
                    <p>
                      <span className="text-accent font-semibold">Email:</span>{" "}
                      <span className="text-secondary">{sub.user.email}</span>
                    </p>
                    <p>
                      <span className="text-accent font-semibold">
                        Category:
                      </span>{" "}
                      <span className="text-primary capitalize">
                        {sub.category}
                      </span>
                    </p>
                    <p>
                      <span className="text-accent font-semibold">Price:</span>{" "}
                      <span className="text-primary font-semibold">
                        {formatCurrency(sub.price)}
                      </span>
                    </p>
                    <p>
                      <span className="text-accent font-semibold">
                        Renewal:
                      </span>{" "}
                      <span className="text-primary">
                        {formatDate(sub.renewalDate)}
                      </span>
                    </p>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sub.status === "active"
                          ? "bg-green-500/20 text-green-300"
                          : sub.status === "cancelled"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-orange-500/20 text-orange-300"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
