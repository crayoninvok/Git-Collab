/* eslint-disable react-hooks/exhaustive-deps */
// src/app/payment/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/helpers/formatPrice";

interface OrderDetails {
  id: number;
  status: string;
  event: {
    title: string;
    date: string;
    venue: string;
  };
  details: Array<{
    quantity: number;
    tickets: Array<{
      category: string;
      price: number;
    }>;
  }>;
  totalPrice: number;
  finalPrice: number;
}

// interface SendEmailSuccess {
//   orderId: string;
// }

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("order_id")?.replace("ORDER-", "");
  const paramOrderId = Number(searchParams.get("order_id")?.split("-")[1]);

  const fetchOrderDetails = async () => {
    if (!orderId) {
      router.push("/");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch order details");

      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendOrderEmailSuccess = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/payment/success-email-order/${paramOrderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          // body: JSON.stringify({
          //   orderId: ,
          // }),
        }
      );
      // alert("Email sent successfully");
    } catch (error) {
      console.log("Error sending email:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      sendOrderEmailSuccess();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-500 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-400">
              Thank you for your purchase. Your ticket is ready!
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-zinc-900 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID</span>
                <span>#{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Event</span>
                <span>{orderDetails.event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date</span>
                <span>
                  {new Date(orderDetails.event.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Venue</span>
                <span>{orderDetails.event.venue}</span>
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="bg-zinc-900 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Ticket Details</h2>
            {orderDetails.details.map((detail, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>
                  {detail.tickets[0].category} × {detail.quantity}
                </span>
                <span>
                  {formatPrice(detail.tickets[0].price * detail.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t border-zinc-700 mt-4 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-orange-500">
                  {formatPrice(orderDetails.finalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/profile"
              className="flex-1 px-6 py-3 bg-orange-500 text-center rounded-lg hover:bg-orange-600 transition-colors"
            >
              View My Tickets
            </Link>
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-zinc-800 text-center rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
