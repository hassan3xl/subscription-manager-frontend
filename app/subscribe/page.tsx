"use client";

import React, { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiService } from "@/lib/apiService";
import { useRouter } from "next/navigation";

interface Service {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  frequency: string;
  description?: string;
}

const SubscribePage = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: "paystack",
    startDate: "",
  });
  const router = useRouter();

  const popularServices: Service[] = [
    {
      id: "netflix",
      name: "Netflix Premium",
      price: 6500,
      currency: "NGN",
      frequency: "monthly",
      category: "movies",
      description: "4K Ultra HD streaming on up to 4 devices",
    },
    {
      id: "spotify",
      name: "Spotify Premium",
      price: 1800,
      currency: "NGN",
      frequency: "monthly",
      category: "music",
      description: "Ad-free music streaming with offline downloads",
    },
    {
      id: "disney",
      name: "Disney+",
      price: 3700,
      currency: "NGN",
      frequency: "monthly",
      category: "movies",
      description: "Disney, Pixar, Marvel, Star Wars & National Geographic",
    },
    {
      id: "youtube-premium",
      name: "YouTube Premium",
      price: 2600,
      currency: "NGN",
      frequency: "monthly",
      category: "entertainment",
      description: "Ad-free videos, background play & YouTube Music",
    },
  ];

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const payload = {
      ...formData,
      name: selectedService.name,
      price: selectedService.price,
      currency: selectedService.currency,
      frequency: selectedService.frequency,
      category: selectedService.category,
    };

    setLoading(true);
    try {
      await apiService.post("/subscriptions", payload);
      onSuccess?.();
      alert("Subscription created successfully!");
      router.push("/subscriptions");
      setSelectedService(null);
      setFormData({ paymentMethod: "paystack", startDate: "" });
    } catch (error) {
      console.error("Error creating subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Service Cards */}
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Choose a Service
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {popularServices.map((service) => (
          <div
            key={service.id}
            className={`p-5 border bg-secondary rounded-xl cursor-pointer hover:shadow-md transition ${
              selectedService?.id === service.id
                ? "border-blue-500 bg-blue-50"
                : "border-border bg-card"
            }`}
            onClick={() => handleSelectService(service)}
          >
            <h3 className="font-semibold text-lg">{service.name}</h3>
            <p className="text-sm text-secondary-foreground mt-1">
              {service.description}
            </p>
            <div className="text-sm text-muted-foreground mt-3">
              {service.currency} {service.price.toLocaleString()} /{" "}
              {service.frequency}
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Form */}
      {selectedService && (
        <form
          onSubmit={handleSubmit}
          className="bg-secondary border border-border rounded-2xl shadow-sm p-6 space-y-4"
        >
          <h3 className="text-xl font-medium">
            Subscribe to {selectedService.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Service Name"
              value={selectedService.name}
              readOnly
              onChange={() => null}
              field="input"
            />

            <Input
              label="Price"
              value={`${
                selectedService.currency
              } ${selectedService.price.toLocaleString()}`}
              readOnly
              field="input"
              onChange={() => null}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Frequency"
              value={selectedService.frequency}
              readOnly
              field="input"
              onChange={() => null}
            />

            <Input
              label="Category"
              value={selectedService.category}
              readOnly
              field="input"
              onChange={() => null}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              field="input"
              required
            />

            <Input
              label="Payment Method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              field="select"
              options={[
                { value: "paystack", label: "Paystack" },
                { value: "card", label: "Card" },
                { value: "bank", label: "Bank Transfer" },
              ]}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Subscription"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SubscribePage;
