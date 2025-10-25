"use client";

import { Subscription } from "@/lib/types";
import { Filter, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import SubsCard from "./SubsCard";
import { Button } from "../ui/button";

interface SubscriptionsListProps {
  subscriptions: Subscription[];
}

type StatusFilter = "all" | "active" | "cancelled";
type CategoryFilter = "all" | string;

const SubscriptionsList = ({ subscriptions }: SubscriptionsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  const router = useRouter();

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(subscriptions.map((sub) => sub.category).filter(Boolean))
    );
    return uniqueCategories.sort();
  }, [subscriptions]);

  // Filter and search logic
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((subscription) => {
      // Search filter
      const matchesSearch = subscription.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || subscription.status === statusFilter;

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || subscription.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [subscriptions, searchTerm, statusFilter, categoryFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm !== "" || statusFilter !== "all" || categoryFilter !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Your Subscriptions</h1>
        <Link className="text-primary" href="/subscribe">
          Add a Subscription
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {
                  [searchTerm, statusFilter, categoryFilter].filter(
                    (filter) => filter !== "" && filter !== "all"
                  ).length
                }
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="w-full p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSubscriptions.length} of {subscriptions.length}{" "}
          subscriptions
        </p>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubscriptions.length > 0 ? (
          filteredSubscriptions.map((subscription) => (
            <SubsCard key={subscription._id} subscription={subscription} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                No subscriptions found
              </h3>
              <p className="mb-4">
                {hasActiveFilters
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first subscription"}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsList;
