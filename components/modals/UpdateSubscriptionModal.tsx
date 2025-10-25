"use client";

import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface UpdateSubscriptionModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  subscription?: any;
  onUpdate: (id: string, data: any) => void;
}

const UpdateSubscriptionModal = ({
  isModalOpen,
  closeModal,
  subscription,
  onUpdate,
}: UpdateSubscriptionModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    frequency: "",
    category: "",
    paymentMethod: "",
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name || "",
        price: subscription.price || "",
        frequency: subscription.frequency || "",
        category: subscription.category || "",
        paymentMethod: subscription.paymentMethod || "",
      });
    }
  }, [subscription]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!subscription?._id) return;
    onUpdate(subscription._id, formData);
  };

  if (!subscription) return null;

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={closeModal}
      title="Edit Subscription"
    >
      <div className="space-y-4 p-4">
        <div>
          <Input
            name="name"
            type="text"
            field="input"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Subscription name"
          />
        </div>

        <div>
          <Input
            label="Price  "
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Amount"
          />
        </div>

        <div>
          <Input
            label="Frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            placeholder="e.g. monthly"
          />
        </div>

        <div>
          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. streaming"
          />
        </div>

        <div>
          <Input
            label="Payment Method"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default UpdateSubscriptionModal;
