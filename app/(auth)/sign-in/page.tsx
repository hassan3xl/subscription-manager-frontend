// src/app/login/page.tsx
"use client";
import { useState } from "react";
import { handleLogin } from "@/actions/auth.actions";
import { apiService } from "@/lib/apiService";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Key, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/ToastProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await apiService.postWithoutToken("/auth/sign-in", {
        email,
        password,
      });

      if (res.success) {
        await handleLogin(res.user, res.token);

        addToast({
          title: "Login successful!",
          description: "Welcome back!",
          type: "success",
          duration: 3000,
        });

        // Small delay to show the toast before redirect
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        addToast({
          title: "Login failed",
          description:
            res.message || "Please check your credentials and try again.",
          type: "error",
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.log("Login error:", error);
      addToast({
        title: "Login error",
        description: `${error.error}`,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center bg-background text-foreground px-4 ">
      <div className="w-full max-w-sm p-8 rounded-2xl shadow-lg border border-border bg-card">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <Input
              id="password"
              icon={Key}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-border" />
          <span className="px-3 text-sm text-muted-foreground">or</span>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Admin Link */}
        <div className="text-center mt-6 pt-6 border-t border-border">
          <Link
            href="/admin/signin"
            className="text-sm text-primary font-medium hover:underline"
          >
            Admin Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
