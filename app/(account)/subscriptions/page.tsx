"use client";

import React, { useEffect, useState } from "react";
import { apiService } from "@/lib/apiService";
import { CalendarDays, DollarSign, RefreshCw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Subscription } from "@/lib/types";
import { useRouter } from "next/navigation";
import SubsCard from "@/components/subscriptions/SubsCard";
import Link from "next/link";
import Loader from "@/components/Loader";
import SubscriptionsList from "@/components/subscriptions/SubscriptionList";

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/subscriptions");
      console.log("res", response.data);
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (loading) {
    return <Loader title="Loading subscriptions..." />;
  }

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <p className="text-secondary mb-4">No subscriptions found.</p>
        <Link className="text-primary" href="/subscribe">
          Add a Subscription
        </Link>
      </div>
    );
  }

  return <SubscriptionsList subscriptions={subscriptions} />;
};

export default SubscriptionsPage;
