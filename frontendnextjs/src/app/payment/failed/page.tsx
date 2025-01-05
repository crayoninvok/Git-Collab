// src/app/payment/failed/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id")?.replace("ORDER-", "");

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500 mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-500 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-400 mb-8">
            We re sorry, but your payment could not be processed. Please try
            again or contact support if the problem persists.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {orderId && (
              <Link
                href={`/payment?order_id=${orderId}`}
                className="px-6 py-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Try Again
              </Link>
            )}
            <Link
              href="/"
              className="px-6 py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
