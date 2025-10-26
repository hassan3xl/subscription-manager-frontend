// Base subscription type (shared between stats and subscriptions)

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
  upcomingRenewals: SubscriptionType[];
}

// Main API response type
export interface DashboardResponse {
  success: boolean;
  message: string;
  stats: DashboardStats;
  subscriptions: SubscriptionType[];
}

export type DashbaordDataType = {
  stats: DashboardStats;
};
type CategoryType = {
  _id: string;
  name: string;
};
type ProductType = {
  _id: string;
  name: string;
  price: number;
  category: CategoryType;
};
export interface SubscriptionType {
  _id: string;
  priceAtSubscription: string;
  product: ProductType;
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
