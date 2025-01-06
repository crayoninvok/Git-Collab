"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/context/useSessionHook";
import { formatPrice } from "@/helpers/formatPrice";
import { Switch } from "@/components/ui/switch";
import withGuard from "@/hoc/pageGuard";
import { Loader2 } from "lucide-react";


interface TicketData {
  id: number;
  eventId: number;
  category: string;
  price: number;
  quantity: number;
  event?: {
    title: string;
    date: string;
    location: string;
    image: string;
  };
}

interface CouponStatus {
  canUseCoupon: boolean;
  couponUsageCount: number;
  remainingCoupons: number;
}

 function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuth } = useSession();
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const [useCoupon, setUseCoupon] = useState(false);
  const [couponAvailable, setCouponAvailable] = useState(false);
  const [couponStatus, setCouponStatus] = useState<CouponStatus>({
    canUseCoupon: false,
    couponUsageCount: 0,
    remainingCoupons: 0
  });
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string>("");

  const ticketId = searchParams.get("ticketId");
  const quantity = Number(searchParams.get("quantity")) || 0;

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token || !isAuth) {
        router.push('/login');
        return;
      }
      await fetchTicketData();
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuth, ticketId, user?.percentage]);

  const fetchTicketData = async () => {
    if (!ticketId) {
      setError("Invalid ticket information");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/login');
        return;
      }

      // First, fetch the ticket data
      const ticketResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/events/ticket/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!ticketResponse.ok) {
        throw new Error("Failed to fetch ticket data");
      }

      const ticketData = await ticketResponse.json();
      setTicketData(ticketData);

      // Only fetch coupon data if it's not a free ticket
      if (ticketData.price > 0 && user?.percentage && ticketData.eventId) {
        const couponStatusResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/payment/check-coupon/${ticketData.eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (couponStatusResponse.ok) {
          const couponStatusData = await couponStatusResponse.json();
          setCouponStatus(couponStatusData);
          setCouponAvailable(couponStatusData.canUseCoupon && couponStatusData.remainingCoupons > 0);
        }
      } else {
        setUsePoints(false);
        setUseCoupon(false);
        setCouponAvailable(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load ticket information. Please try again.");
    }
  };

  const calculateTotalPrice = () => {
    if (!ticketData) return 0;
    let total = ticketData.price * quantity;

    if (ticketData.price > 0) {
      if (usePoints && user?.points && user.points >= 10000) {
        total -= 10000;
      }

      if (useCoupon && user?.percentage && couponAvailable) {
        total = total * (1 - user.percentage / 100);
      }
    }

    return Math.max(total, 0);
  };

  const handlePayment = async () => {
  if (!ticketId || !quantity || !user || !ticketData) {
    setError("Missing required information");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/login');
      return;
    }

    const isFreeTicket = ticketData.price === 0;

    const orderBody = {
      eventId: Number(ticketData.eventId),
      ticketId: Number(ticketId),
      quantity: Number(quantity),
      totalPrice: ticketData.price * Number(quantity),
      finalPrice: calculateTotalPrice(),
      usePoints: isFreeTicket ? false : (usePoints && user.points >= 10000),
      useCoupon: isFreeTicket ? false : (useCoupon && couponAvailable),
      status: isFreeTicket ? "PAID" : "PENDING" // Set initial status for free tickets
    };

    const orderResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL_BE}/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderBody),
      }
    );

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      throw new Error(errorData.message || "Failed to create order");
    }

    const orderResult = await orderResponse.json();

    if (isFreeTicket) {
      // For free tickets, send success email and redirect to success page
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/payment/success-email-order/${orderResult.data.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (emailError) {
        console.error("Error sending success email:", emailError);
      }
      
      // Redirect to success page instead of my-tickets
      router.push(`/payment/success?order_id=ORDER-${orderResult.data.id}`);
      return;
    }

    // Rest of the code for paid tickets...
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
      const errorData = await paymentResponse.json();
      throw new Error(errorData.message || "Failed to create payment");
    }

    const paymentResult = await paymentResponse.json();

    if (paymentResult.data?.paymentUrl) {
      window.location.href = paymentResult.data.paymentUrl;
    } else {
      throw new Error("No payment URL received");
    }
  } catch (error) {
    console.error("Payment error:", error);
    setError(error instanceof Error ? error.message : "Failed to process payment. Please try again.");
  } finally {
    setLoading(false);
  }
};

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
        {error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading ticket information...</span>
          </div>
        )}
      </div>
    );
  }

  const isFreeTicket = ticketData.price === 0;

  return (
    <div className="min-h-screen bg-black text-white py-12 pt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-zinc-900 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-8">
            {isFreeTicket ? 'Order Details' : 'Payment Details'}
          </h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                {ticketData.event?.title}
              </h2>
              <div className="space-y-2">
                <p>Ticket Type: {ticketData.category}</p>
                <p>Order Quantity: {quantity}</p>
                <p>
                  Price per ticket:{" "}
                  {isFreeTicket ? "Free" : formatPrice(ticketData.price)}
                </p>
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
                          {couponStatus.remainingCoupons > 0
                            ? `${couponStatus.remainingCoupons} coupons remaining`
                            : "No more coupons available"}
                        </p>
                      </div>
                      <Switch
                        checked={useCoupon}
                        onCheckedChange={setUseCoupon}
                        disabled={!couponAvailable}
                      />
                    </div>
                    {!couponStatus.canUseCoupon && (
                      <p className="text-center text-sm text-gray-400">
                        You have already used a coupon for this event
                      </p>
                    )}
                    {couponStatus.remainingCoupons === 0 && (
                      <p className="text-center text-sm text-gray-400">
                        All coupons for this event have been claimed
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="bg-zinc-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Total Payment</h3>
              <p className="text-2xl font-bold text-orange-500">
                {isFreeTicket ? "Free" : formatPrice(calculateTotalPrice())}
              </p>
              {!isFreeTicket && usePoints && (
                <p className="text-sm text-gray-400">-Rp 10,000 (Points)</p>
              )}
              {!isFreeTicket && useCoupon && user?.percentage && (
                <p className="text-sm text-gray-400">
                  -{user.percentage}% (Coupon)
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
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : isFreeTicket ? (
                "Confirm Order"
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withGuard(PaymentPage, {
  requiredRole: "user",
  redirectTo: "/not-authorized-payment",
});
