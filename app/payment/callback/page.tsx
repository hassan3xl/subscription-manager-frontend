"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiService } from "@/lib/apiService";

const PaymentCallbackPage = () => {
  const [status, setStatus] = useState<
    "verifying" | "success" | "failed" | "error"
  >("verifying");
  const [message, setMessage] = useState("Verifying your payment...");
  const searchParams = useSearchParams();
  const router = useRouter();

  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentReference = reference || trxref;

        if (!paymentReference) {
          setStatus("error");
          setMessage("No payment reference found. Please contact support.");
          return;
        }

        // Verify payment with your backend
        const response = await apiService.post(
          "/subscriptions/verify-payment",
          {
            reference: paymentReference,
          }
        );

        if (response.success) {
          setStatus("success");
          setMessage(
            "Payment successful! Your subscription has been activated."
          );

          // Redirect to subscriptions page after 3 seconds
          setTimeout(() => {
            router.push("/subscriptions");
          }, 3000);
        } else {
          setStatus("failed");
          setMessage(response.message || "Payment verification failed.");
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setStatus("error");
        setMessage(
          error.message || "Error verifying payment. Please contact support."
        );
      }
    };

    verifyPayment();
  }, [reference, trxref, router]);

  const getStatusStyles = () => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "failed":
        return "bg-red-50 border-red-200 text-red-800";
      case "error":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div
          className={`border rounded-2xl p-8 text-center ${getStatusStyles()}`}
        >
          <div className="mb-4">
            {status === "verifying" && (
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            )}
            {status === "success" && (
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            )}
            {(status === "failed" || status === "error") && (
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold mb-2">
            {status === "verifying" && "Verifying Payment"}
            {status === "success" && "Payment Successful"}
            {status === "failed" && "Payment Failed"}
            {status === "error" && "Error"}
          </h2>

          <p className="mb-6">{message}</p>

          {status === "success" && (
            <p className="text-sm opacity-75">
              Redirecting to subscriptions page...
            </p>
          )}

          {(status === "failed" || status === "error") && (
            <button
              onClick={() => router.push("/subscribe")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallbackPage;
