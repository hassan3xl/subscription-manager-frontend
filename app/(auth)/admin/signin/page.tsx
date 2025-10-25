"use client";

import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { apiService } from "@/lib/apiService";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/actions/auth.actions";
import { useToast } from "@/providers/ToastProvider";

/**
 * Use plain string[] for the verification code (you used array semantics).
 */
type VerificationCode = string[];

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<VerificationCode>(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { addToast } = useToast();

  // Keep refs array length bounded to 6
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // -------------------------
  // Email / OTP submission
  // -------------------------
  const handleEmailSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res: any = await apiService.post("/auth/admin/request-otp", {
        email,
      });

      console.log("OTP response:", res);

      if (res && res.message === "OTP sent successfully") {
        setStep("otp");
        setTimeLeft(60);
        setCode(["", "", "", "", "", ""]);
        // focus first input after switching to otp
        setTimeout(() => inputRefs.current[0]?.focus(), 0);
      } else {
        throw new Error(res?.message || "Failed to send OTP");
      }
    } catch (err: any) {
      console.error("OTP send error:", err);
      addToast({
        title: "Error sending OTP",
        description: `${err?.error || "Failed to send OTP"}`,
        type: "error",
        duration: 3000,
      });
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // OTP input handling
  // -------------------------
  const handleCodeChange = (index: number, value: string): void => {
    // Only allow numbers (empty string allowed)
    if (value && !/^\d+$/.test(value)) return;

    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input when a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Backspace") {
      // If current input is empty and not first input, focus previous
      if (!code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (code[index]) {
        // If current input has value, clear it but stay focused
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const pastedNumbers = pastedData.replace(/\D/g, "").split("").slice(0, 6);

    if (pastedNumbers.length > 0) {
      const newCode = ["", "", "", "", "", ""];
      pastedNumbers.forEach((num, idx) => {
        newCode[idx] = num;
      });
      setCode(newCode);

      // Focus the last filled input or the last input if full paste
      const lastIndex = Math.min(pastedNumbers.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  // -------------------------
  // Verify OTP
  // -------------------------
  const handleOtpSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const otp = code.join("");
      const res: any = await apiService.post("/auth/admin/verify-otp", {
        email,
        otp,
      });

      console.log("Verify OTP response:", res);

      if (res && res.token) {
        await handleLogin(res.admin, res.token);
        addToast({
          title: "Login successful!",
          description: "Welcome back!",
          type: "success",
          duration: 3000,
        });
        router.push("/admin/dashboard");
      } else {
        throw new Error(res?.message || "Invalid OTP");
      }
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Resend OTP
  // -------------------------
  const handleResend = async (): Promise<void> => {
    if (!email) return;
    setTimeLeft(60);
    setError(null);
    setCode(["", "", "", "", "", ""]);
    setTimeout(() => inputRefs.current[0]?.focus(), 0);

    try {
      const res: any = await apiService.post("/auth/admin/request-otp", {
        email,
      });

      if (res && res.message === "OTP sent successfully") {
        addToast({
          title: "OTP resent successfully",
          description: "Please check your email",
          type: "success",
          duration: 3000,
        });
      } else {
        throw new Error(res?.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP");
    }
  };

  // -------------------------
  // Timer countdown
  // -------------------------
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => window.clearTimeout(timer);
    }
    // no cleanup needed when timeLeft === 0
    return;
  }, [timeLeft]);

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-md">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={32} className="text-slate-600" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            {step === "email" ? "Admin Login" : "Verify Your Email"}
          </h1>
          <p className="text-primary">
            {step === "email"
              ? "Enter your admin email to receive an OTP"
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Enter your admin email"
              className="w-full border-2 border-border rounded-xl p-3 focus:border-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="flex space-x-3 justify-center">
              {code.map((digit: string, index: number) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleCodeChange(index, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-border rounded-xl focus:border-blue-500 focus:outline-none"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || code.some((digit) => !digit)}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-secondary mb-2">Didn't receive the code?</p>
              {timeLeft > 0 ? (
                <p className="text-sm text-accent">Resend in {timeLeft}s</p>
              ) : (
                <Button onClick={handleResend} variant="outline" size="sm">
                  Resend Code
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;
