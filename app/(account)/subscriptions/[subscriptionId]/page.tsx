"use client";

import React, { useEffect, useState } from "react";
import { apiService } from "@/lib/apiService";
import { useParams } from "next/navigation";
import SubsCard from "@/components/subscriptions/SubsCard";
import Loader from "@/components/Loader";
import { Subscription } from "@/lib/types";

const SubscriptionDetails = () => {
  const params = useParams();
  const subscriptionId = params?.id as string;

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      const response = await apiService.get(`subscriptions/${subscriptionId}`);
      setSubscription(response.data.data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subscriptionId) fetchSubscription();
  }, [subscriptionId]);

  if (loading) return <Loader title="Loading subscription" />;

  if (!subscription) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-gray-500">
        Subscription not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <SubsCard subscription={subscription} key={subscription._id} />
    </div>
  );
};

export default SubscriptionDetails;
