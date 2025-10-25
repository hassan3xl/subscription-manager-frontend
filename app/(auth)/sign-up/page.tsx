// src/app/sign-up/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Mail, User2, Eye, EyeOff } from "lucide-react";
import { apiService } from "@/lib/apiService";
import { useRouter } from "next/navigation";
import { useToast } from "@/providers/ToastProvider";

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (form.password.length < 6) {
      addToast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        type: "error",
        duration: 5000,
      });
      setIsLoading(false);
      return;
    }

    if (form.name.length < 2) {
      addToast({
        title: "Invalid name",
        description: "Please enter your full name",
        type: "error",
        duration: 5000,
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiService.postWithoutToken("/auth/sign-up", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (res.success) {
        addToast({
          title: "Account created successfully!",
          description: "Please sign in.",
          type: "success",
          duration: 6000,
        });

        // Redirect to login page after successful signup
        setTimeout(() => {
          router.push("/login-in");
        }, 2000);
      } else {
        addToast({
          title: "Sign up failed",
          description:
            res.message || "Please check your information and try again.",
          type: "error",
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error("Sign up error:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message?.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message?.includes("409")) {
        errorMessage = "An account with this email already exists.";
      }

      addToast({
        title: "Sign up error",
        description: errorMessage,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-8">
      <div className="w-full max-w-sm p-8 rounded-2xl shadow-lg border border-border bg-card">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join us today and get started</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="name"
              icon={User2}
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="John Doe"
              disabled={isLoading}
              minLength={2}
              className="w-full"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              icon={Mail}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@example.com"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                icon={Key}
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder="At least 6 characters"
                disabled={isLoading}
                minLength={6}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters long
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-border" />
          <span className="px-3 text-sm text-muted-foreground">or</span>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
