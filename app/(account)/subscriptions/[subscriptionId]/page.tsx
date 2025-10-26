"use client";

import React, { useEffect, useState } from "react";
import { apiService } from "@/lib/apiService";
import { useParams } from "next/navigation";
import SubsCard from "@/components/subscriptions/SubsCard";
import Loader from "@/components/Loader";
import { SubscriptionType } from "@/lib/types";

const SubscriptionDetails = () => {
  const params = useParams();
  const subscriptionId = params?.subscriptionId as string;
  console.log(params);

  const [subscription, setSubscription] = useState<SubscriptionType | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      console.log("Fetching:", `/subscriptions/${subscriptionId}`);
      const response = await apiService.get(`/subscriptions/${subscriptionId}`);
      console.log("Response:", response.data);
      setSubscription(response.data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("subscriptionId:", subscriptionId);
    if (subscriptionId) fetchSubscription();
  }, [subscriptionId]);

  if (loading) return <Loader title="Loading subscription details" />;

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
