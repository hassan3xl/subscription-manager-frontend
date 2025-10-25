// Base subscription type (shared between stats and subscriptions)
export interface Subscription {
  _id: string;
  name: string;
  price: number;
  currency: string;
  frequency: string;
  category: string;
  status: "active" | "cancelled" | "expired";
  cancelledAt: string | null;
  paymentMethod: string;
  startDate: string;
  renewalDate: string;
  reminders: string[];
  reminderSent: boolean;
  user: string;
  reminderDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Category statistics type
export interface CategoryStat {
  count: number;
  totalSpent: number;
  category: string;
}

// Dashboard statistics type
export interface DashboardStats {
  totalSubscriptions: number;
  activeCount: number;
  cancelledCount: number;
  expiredCount: number;
  totalSpent: number;
  categoryStats: CategoryStat[];
  upcomingRenewals: Subscription[];
}

// Main API response type
export interface DashboardResponse {
  success: boolean;
  message: string;
  stats: DashboardStats;
  subscriptions: Subscription[];
}

export type DashbaordDataType = {
  stats: DashboardStats;
};
