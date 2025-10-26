"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import {
  X,
  Users,
  CreditCard,
  Settings,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";
import { useModal } from "@/providers/ModalProvider";

const AdminManageModal = () => {
  const { closeModal } = useModal();
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [closeModal]);

  const menuItems = [
    {
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      description: "Overview and analytics",
    },
    {
      href: "/admin/users",
      icon: Users,
      label: "Users",
      description: "Manage user accounts",
    },
    {
      href: "/admin/subscriptions",
      icon: CreditCard,
      label: "Subscriptions",
      description: "Billing and plans",
    },

    {
      href: "/admin/products",
      icon: ShoppingBag,
      label: "Products",
      description: "Products and Categories",
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Settings",
      description: "Configure preferences",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-background border rounded-lg shadow-2xl mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Manage</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Access admin tools and settings
              </p>
            </div>
            <button
              onClick={closeModal}
              className="rounded-md p-2 hover:bg-accent transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="p-4 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeModal}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent transition-all duration-200 group border border-transparent hover:border-border animate-in slide-in-from-bottom-2"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <div className="rounded-md p-2 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium group-hover:text-primary transition-colors">
                      {item.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="h-5 w-5 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div className="hidden lg:block p-4 border-t bg-muted/50">
            <p className="text-xs text-muted-foreground text-center">
              Press{" "}
              <kbd className="px-2 py-1 bg-background border rounded text-xs">
                Esc
              </kbd>{" "}
              to close
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminManageModal;
