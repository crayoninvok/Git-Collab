"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/context/useSessionHook";
import { formatPrice } from "@/helpers/formatPrice";
import { Switch } from "@/components/ui/switch";
import NotAuthorized from "@/components/not-authorized/not";

interface TicketData {
  id: number;
  eventId: number;
  category: string;
  price: number;
  quantity: number;
  event?: {
    title: string;
  };
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSession();
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const [useCoupon, setUseCoupon] = useState(false);
  const [couponAvailable, setCouponAvailable] = useState(false);
  const [usersWithCoupon, setUsersWithCoupon] = useState(0);
  const [isAllowUseCoupon, setIsAllowUseCoupon] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const ticketId = searchParams.get("ticketId");
  const quantity = Number(searchParams.get("quantity"));

  const isFreeTicket = ticketData?.price === 0;

  const fetchTicketData = async () => {
    if (!ticketId || !user) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/login');
        return;
      }

      const [ticketResponse, couponResponse, checkCouponResponse] =
        await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/events/ticket/${ticketId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL_BE}/orders/coupon-count/${ticketId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL_BE}/orders/check-user-coupon`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      if (!ticketResponse.ok || !couponResponse.ok || !checkCouponResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const ticketData = await ticketResponse.json();
      const couponData = await couponResponse.json();
      const checkCouponData = await checkCouponResponse.json();

      setTicketData(ticketData);
      setUsersWithCoupon(couponData.count || 0);
      setIsAllowUseCoupon(checkCouponData.canUseCoupon);
      setCouponAvailable(Boolean(user?.percentage) && couponData.count < 10);

      // Reset discount selections if it's a free ticket
      if (ticketData.price === 0) {
        setUsePoints(false);
        setUseCoupon(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      router.push("/");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsChecking(false);
      return;
    }
    
    setIsChecking(false);
    fetchTicketData();
  }, [ticketId, user?.percentage]);

  const calculateTotalPrice = () => {
    if (!ticketData) return 0;
    let total = ticketData.price * quantity;

    // Only apply discounts if it's not a free ticket
    if (!isFreeTicket) {
      if (usePoints && user?.points && user.points >= 10000) {
        total -= 10000;
      }

      if (useCoupon && user?.percentage) {
        total = total * (1 - user.percentage / 100);
      }
    }

    return Math.max(total, 0);
  };

  const handlePayment = async () => {
    if (!ticketId || !quantity || !user || !ticketData) {
      alert("Missing required fields");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            eventId: ticketData.eventId,
            ticketId: Number(ticketId),
            quantity: Number(quantity),
            totalPrice: ticketData.price * Number(quantity),
            finalPrice: calculateTotalPrice(),
            usePoints: isFreeTicket ? false : (usePoints && user.points >= 10000),
            useCoupon: isFreeTicket ? false : (isAllowUseCoupon && useCoupon && couponAvailable),
            status: isFreeTicket ? "SUCCESS" : "PENDING",
          }),
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderResult = await orderResponse.json();
      console.log("Order Response:", orderResult); // For debugging

      // If it's a free ticket, skip payment processing
      if (isFreeTicket) {
        try {
          // Additional verification API call to ensure the order is processed
          const token = localStorage.getItem("token");
          const verifyResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL_BE}/orders/${orderResult.data.id}/verify`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!verifyResponse.ok) {
            throw new Error("Failed to verify order");
          }

          window.location.href = `/tickets/my-tickets`;
          return;
        } catch (error) {
          console.error("Verification error:", error);
          alert("Failed to process free ticket order");
          return;
        }
      }

      const paymentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/payment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: orderResult.data.id,
          }),
        }
      );

      if (!paymentResponse.ok) {
        throw new Error("Failed to create payment");
      }

      const paymentResult = await paymentResponse.json();

      if (paymentResult.data?.paymentUrl) {
        window.location.href = paymentResult.data.paymentUrl;
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-orange-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <NotAuthorized
        title="Authentication Required"
        description="Please sign in to proceed with your payment."
      />
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-zinc-900 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-8">
            {isFreeTicket ? 'Order Details' : 'Payment Details'}
          </h1>

          <div className="space-y-6">
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                {ticketData.event?.title}
              </h2>
              <div className="space-y-2">
                <p>Ticket Type: {ticketData.category}</p>
                <p>Available Quantity: {ticketData.quantity}</p>
                <p>Your Order Quantity: {quantity}</p>
                <p>Price per ticket: {isFreeTicket ? 'Free' : formatPrice(ticketData.price)}</p>
              </div>
            </div>

            {!isFreeTicket && (
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Discounts</h3>

                {user?.points && user.points >= 10000 && (
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p>Use Points (10,000 pts = Rp 10,000)</p>
                      <p className="text-sm text-gray-400">
                        Available: {formatPrice(user.points)} pts
                      </p>
                    </div>
                    <Switch checked={usePoints} onCheckedChange={setUsePoints} />
                  </div>
                )}

                {user?.percentage && (
                  <div className="flex flex-col gap-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Use Coupon ({user.percentage}% discount)</p>
                        <p className="text-sm text-gray-400">
                          {couponAvailable
                            ? `${10 - usersWithCoupon} coupons remaining`
                            : "No more coupons available"}
                        </p>
                      </div>
                      <Switch
                        checked={useCoupon}
                        onCheckedChange={setUseCoupon}
                        disabled={isAllowUseCoupon ? !couponAvailable : true}
                      />
                    </div>
                    {!isAllowUseCoupon && (
                      <p className="text-center text-sm">
                        You has been used the coupon at another event
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="bg-zinc-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Total Payment</h3>
              <p className="text-2xl font-bold text-orange-500">
                {isFreeTicket ? 'Free' : formatPrice(calculateTotalPrice())}
              </p>
              {!isFreeTicket && usePoints && (
                <p className="text-sm text-gray-400">-Rp 10,000 (Points)</p>
              )}
              {!isFreeTicket && useCoupon && (
                <p className="text-sm text-gray-400">
                  -{user?.percentage}% (Coupon)
                </p>
              )}
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {loading ? "Processing..." : isFreeTicket ? "Confirm Order" : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}