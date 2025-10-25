"use client";

import React, { useState, useEffect } from "react";

import {
  Users,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { apiService } from "@/lib/apiService";
import Loader from "@/components/Loader";
import { formatCurrency, formatDate, getMonthName } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  //   if (loading) {
  //     return <Loader />;
  //   }

  //   if (!data) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-4xl font-bold text-primary mb-2">
              Manage
            </h1>
          </div>
          <div className="flex gap-2">
            <Button className="bg-accent text-primary font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Manage
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
              <p>users</p>
            </div>
          </div>

          <div className="bg-muted backdrop-blur-lg rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent rounded-xl">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>

          <div className="bg-muted backdrop-blur-lg rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent rounded-xl">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>

          <div className="bg-muted backdrop-blur-lg rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent rounded-xl">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
