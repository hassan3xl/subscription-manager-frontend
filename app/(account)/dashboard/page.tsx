"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Calendar, TrendingUp, CreditCard, Package } from "lucide-react";
import { apiService } from "@/lib/apiService";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency, formatDate, getDaysUntilRenewal } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import Header from "@/components/Header";

const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b"];

const DashboardPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/dashboard");
      setDashboardData(response);
    } catch (error: any) {
      addToast({
        title: "Error",
        description: `${error.error || "Failed to load dashboard"}`,
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader title="Loading subscriptions..." />;
  }

  // Pie chart data (category spending)
  const pieData =
    dashboardData?.stats?.categoryStats?.map((cat: any) => ({
      name: cat.category?.name || "Uncategorized",
      value: cat.totalSpent,
      count: cat.count,
    })) || [];

  // Filter subscriptions by category
  const filteredSubscriptions = selectedCategory
    ? dashboardData?.subscriptions.filter(
        (sub: any) => sub.product?.category?.name === selectedCategory
      )
    : dashboardData?.subscriptions;

  const avgSpent =
    dashboardData?.stats?.totalSpent && dashboardData?.stats?.totalSubscriptions
      ? Math.round(
          dashboardData.stats.totalSpent /
            dashboardData.stats.totalSubscriptions
        )
      : 0;
  const stats = [
    {
      title: "Total Subscriptions",
      value: dashboardData?.stats.totalSubscriptions,
      icon: <Package className="w-6 h-6" />,
    },
    {
      title: "Active",
      value: dashboardData?.stats.activeCount,
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Total Spent",
      value: formatCurrency(dashboardData?.stats.totalSpent ?? 0),
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      title: "Avg per Month",
      value: formatCurrency(avgSpent),
      icon: <Calendar className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <Header
          title="Dashboard"
          subtitle="Track and manage all your subscriptions"
          // onRefresh={fetchDashboardData}
          stats={stats}
        />

        {/* Category chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-muted backdrop-blur-lg rounded-2xl p-6 border border-border">
            <h2 className="text-xl font-bold text-primary mb-6">
              Spending by Category
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((index: any) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="lg:col-span-2 bg-muted backdrop-blur-lg rounded-2xl p-6 border border-border">
            <h2 className="text-xl font-bold text-primary mb-6">
              Category Breakdown
            </h2>
            <div className="space-y-4">
              {dashboardData?.stats.categoryStats.map(
                (cat: any, idx: number) => (
                  <div
                    key={cat.category?.name || idx}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedCategory === cat.category?.name
                        ? "bg-white/20 border-2 border-white/40"
                        : "bg-white/5 hover:bg-secondary border-2 border-transparent"
                    }`}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === cat.category?.name
                          ? null
                          : cat.category?.name
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[idx] }}
                        />
                        <div>
                          <p className="text-primary font-semibold capitalize">
                            {cat.category?.name || "Uncategorized"}
                          </p>
                          <p className="text-secondary text-sm">
                            {cat.count} subscription{cat.count > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-bold">
                          {formatCurrency(cat.totalSpent)}
                        </p>
                        <p className="text-secondary text-sm">
                          {Math.round(
                            (cat.totalSpent / dashboardData?.stats.totalSpent) *
                              100
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Subscriptions */}
        <div className="backdrop-blur-lg rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">
              {selectedCategory
                ? `${selectedCategory} Subscriptions`
                : "Recent Subscriptions"}
            </h2>
            <div className="space-x-2">
              {selectedCategory && (
                <Button onClick={() => setSelectedCategory(null)}>
                  Clear filter
                </Button>
              )}
              <Link
                className="px-4 py-2 bg-secondary text-secondary rounded-md"
                href="/subscriptions"
              >
                View all
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {filteredSubscriptions?.slice(0, 5).map((sub: any) => {
              const product = sub.product;
              const category = product?.category?.name || "Uncategorized";
              const daysUntil = getDaysUntilRenewal(sub.renewalDate);

              return (
                <div
                  key={sub._id}
                  className="bg-accent rounded-xl p-5 hover:bg-secondary transition-all border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-primary text-lg">
                        {product?.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-primary font-semibold text-lg">
                          {product?.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-secondary text-sm capitalize">
                            {category}
                          </span>
                          <span className="text-secondary text-sm">•</span>
                          <span className="text-secondary text-sm capitalize">
                            {sub.frequency}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold text-xl">
                        {formatCurrency(product?.price)}
                      </p>
                      <p className="text-secondary text-sm mt-1">
                        Renews in {daysUntil} day{daysUntil !== 1 ? "s" : ""}
                      </p>
                      <p className="text-secondary text-xs mt-1">
                        {formatDate(sub.renewalDate)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
