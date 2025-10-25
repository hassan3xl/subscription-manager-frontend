"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React from "react";

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-2">SubsManager</h1>
        <p className="text-secondary-foreground text-lg">
          Track, manage, and stay in control of your subscriptions easily.
        </p>
      </header>

      {/* Features */}
      <section className="grid sm:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="p-6 rounded-2xl bg-secondary border border-border text-center">
          <h3 className="text-lg font-semibold mb-2 text-primary">Monitor</h3>
          <p className="text-sm text-secondary-foreground">
            View all your active and upcoming subscriptions in one dashboard.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-secondary border border-border text-center">
          <h3 className="text-lg font-semibold mb-2 text-primary">Reminders</h3>
          <p className="text-sm text-secondary-foreground">
            Never miss a renewal date with smart notifications.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-secondary border border-border text-center">
          <h3 className="text-lg font-semibold mb-2 text-primary">Analytics</h3>
          <p className="text-sm text-secondary-foreground">
            Get insights into your spending habits and recurring costs.
          </p>
        </div>
      </section>

      {/* Call to action */}
      <div className="mt-12">
        {user ? (
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            proceed to dashboard
          </Link>
        ) : (
          <Link
            href="/sign-up"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            Get Started
          </Link>
        )}
      </div>
    </main>
  );
}
