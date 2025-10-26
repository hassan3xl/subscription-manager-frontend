"use client";
import React, { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Calendar,
  CreditCard,
  Bell,
  Tag,
  Package,
} from "lucide-react";
import { apiService } from "@/lib/apiService";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import DeleteSubscriptionModal from "@/components/modals/DeleteSubscriptionModal";
import UpdateSubscriptionModal from "@/components/modals/UpdateSubscriptionModal";
import { SubscriptionType } from "@/lib/types";
import TestModal from "@/components/modals/TestModal";
import Header from "@/components/Header";

const AdminSubscriptionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);
  const [editingSubscription, setEditingSubscription] =
    useState<SubscriptionType | null>(null);
  const [deletingSubscription, setDeletingSubscription] =
    useState<SubscriptionType | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // open modal functions
  const openEditModal = (subscription: SubscriptionType) => {
    setEditingSubscription(subscription);
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (subscription: SubscriptionType) => {
    setDeletingSubscription(subscription);
    setIsDeleteModalOpen(true);
  };

  // close modal functions
  const closeEditModal = () => {
    setIsUpdateModalOpen(false);
    setEditingSubscription(null);
  };
  const closeDeleteModal = () => {
    setDeletingSubscription(null);
    setIsDeleteModalOpen(false);
  };

  const { addToast } = useToast();

  // ✅ Fetch all subscriptions
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/admin/subscriptions");
      setSubscriptions(response.data);
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.error || "Failed to load subscriptions",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    console.log("handleDelete clicked");
    try {
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  const handleEdit = async (id: string, updatedData: any) => {
    try {
      const response = await apiService.patch(
        `/admin/subscriptions/${id}`,
        updatedData
      );

      addToast({
        title: "Updated",
        description: "Subscription updated successfully",
        type: "success",
        duration: 3000,
      });

      // Refresh list
      await fetchSubscriptions();
      closeEditModal();
    } catch (error: any) {
      console.error("Error updating subscription:", error);
      addToast({
        title: "Error",
        description: error.error || "Failed to update subscription",
        type: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (loading) return <Loader title="Loading subscriptions" />;
  const stats = [
    {
      title: "Total Subscriptions",
      value: subscriptions.length,
      icon: <Package className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(
        subscriptions.reduce((total, subscription) => {
          return total + subscription.price;
        }, 0)
      ),
      icon: <CreditCard className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Total Subscriptions",
      value: subscriptions.length,
      icon: <Package className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(
        subscriptions.reduce((total, subscription) => {
          return total + subscription.price;
        }, 0)
      ),
      icon: <CreditCard className="w-6 h-6 text-blue-600" />,
    },
  ];
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header
          title="Products and categories"
          subtitle="Overview of products and categories."
          // onRefresh={fetchDashboardData}
          stats={stats}
        />

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <div
              key={subscription._id}
              className="bg-muted rounded-xl p-6 hover:shadow-lg transition-all border border-border group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {subscription.product.category.name}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                          subscription.status
                        )}`}
                      >
                        {subscription.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                    onClick={() => openEditModal(subscription)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => openDeleteModal(subscription)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {/* {formatCurrency(subscription.price, subscription.currency)} */}
                  </span>
                  <span className="text-muted-foreground">
                    /{subscription.frequency}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground capitalize">
                    {subscription.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground capitalize">
                    {subscription.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Next: {formatDate(subscription.renewalDate)}
                  </span>
                </div>
                {!subscription.reminderSent && (
                  <div className="flex items-center gap-2 text-sm">
                    <Bell className="h-4 w-4 text-yellow-500" />
                    <span className="text-yellow-500">
                      Reminder: {formatDate(subscription.reminderDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {subscriptions.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No subscriptions found
            </h3>
            <p className="text-muted-foreground">
              There are no subscriptions to display.
            </p>
          </div>
        )}
      </div>

      <UpdateSubscriptionModal
        subscription={editingSubscription}
        isModalOpen={isUpdateModalOpen}
        closeModal={closeEditModal}
        onUpdate={handleEdit}
      />

      <DeleteSubscriptionModal
        subscription={deletingSubscription}
        isModalOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default AdminSubscriptionsPage;
