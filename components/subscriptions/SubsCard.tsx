import React, { useState, useMemo } from "react";
import { Button } from "../ui/button";
import {
  Bell,
  CalendarDays,
  DollarSign,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { Subscription } from "@/lib/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Filter types

interface SubscriptionProp {
  subscription: Subscription;
}

const SubsCard = ({ subscription }: SubscriptionProp) => {
  const router = useRouter();

  const manageSubscription = () => {
    router.push(`subscriptions/${subscription._id}`);
  };

  return (
    <div className="bg-secondary border border-border rounded-2xl shadow-sm p-6 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold ">{subscription.name}</h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            subscription.status === "active"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : subscription.status === "cancelled"
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {subscription.status}
        </span>
      </div>

      <div className="space-y-3 text-secondary">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span className="font-medium">
            {subscription.currency} {subscription.price} /{" "}
            {subscription.frequency}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-gray-500" />
          <span>Payment Method: {subscription.paymentMethod}</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gray-500" />
          <span>
            Renewal Date:{" "}
            {new Date(subscription.renewalDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-gray-500" />
          <span>Category: {subscription.category}</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button className="flex-1" onClick={() => manageSubscription()}>
          Manage
        </Button>
      </div>
    </div>
  );
};

export default SubsCard;

// Main component with search and filters
