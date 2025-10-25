import React from "react";
import BaseModal from "./BaseModal";

interface TestModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}
const TestModal = ({ isModalOpen, closeModal }: TestModalProps) => {
  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={closeModal}
      title="Manage Account"
      description="Access account settings and preferences"
    >
      <div>dihdkshdjkakjask</div>
    </BaseModal>
  );
};

export default TestModal;
