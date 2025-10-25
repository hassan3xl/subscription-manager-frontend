import React from "react";
import BaseModal from "./BaseModal";
import { AlertTriangle, Trash2 } from "lucide-react";
import { formatCurrency, getCategoryIcon, getStatusColor } from "@/lib/utils";
import { Button } from "../ui/button";

interface DeleteSubscriptionModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  subscription?: any;
  handleDelete: () => void;
}
const DeleteSubscriptionModal = ({
  isModalOpen,
  closeModal,
  subscription,
  handleDelete,
}: DeleteSubscriptionModalProps) => {
  console.log("subs", subscription);
  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={closeModal}
      title="Delete Subscription"
      description=""
    >
      <div className="p-6">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>

        <h2 className="text-xl font-semibold text-center mb-2">
          Are you sure?
        </h2>
        <p className="text-muted-foreground text-center mb-4">
          This will permanently delete{" "}
          <span className="font-semibold text-foreground">
            {subscription?.name}
          </span>
          . This action cannot be undone.
        </p>

        {/* Subscription? Info */}
        <div className="bg-accent rounded-lg p-4 mb-6 flex items-center gap-3">
          <div className="text-3xl">
            {/* {getCategoryIcon(subscription?.category)} */}
          </div>

          <div className="flex-1">
            <p className="font-medium">{subscription?.name}</p>
            <p className="text-sm text-muted-foreground">
              {/* {formatCurrency(subscription?.price, subscription?.currency)}/ */}
              {subscription?.frequency}
            </p>
          </div>

          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              subscription?.status
            )}`}
          >
            {subscription?.status}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={closeModal}
            // disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            className="flex-1 gap-2"
            // disabled={submitting}
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteSubscriptionModal;
