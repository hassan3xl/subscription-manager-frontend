import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatCurrency = (amount: number) => {
  return `₦${amount.toLocaleString()}`;
};

export const getMonthName = (month: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[month - 1];
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "text-green-500 bg-green-500/10";
    case "cancelled":
      return "text-red-500 bg-red-500/10";
    case "paused":
      return "text-yellow-500 bg-yellow-500/10";
    default:
      return "text-gray-500 bg-gray-500/10";
  }
};

export const getDaysUntilRenewal = (renewalDate: string) => {
  const today = new Date();
  const renewal = new Date(renewalDate);
  const diffTime = renewal.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
