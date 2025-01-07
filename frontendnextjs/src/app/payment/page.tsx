"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/context/useSessionHook";
import { formatPrice } from "@/helpers/formatPrice";
import { Switch } from "@/components/ui/switch";
import withGuard from "@/hoc/pageGuard";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  message?: string;
}

function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuth } = useSession();
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const [useCoupon, setUseCoupon] = useState(false);
  const [couponStatus, setCouponStatus] = useState<CouponStatus>({
    canUseCoupon: false,
    couponUsageCount: 0,
    remainingCoupons: 0,
  });
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string>("");

  const ticketId = searchParams.get("ticketId");
  const quantity = Number(searchParams.get("quantity")) || 0;

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuth) {
        router.push('/login');
        return;
      }
      await fetchTicketData();
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuth, ticketId]);

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

      // Fetch ticket data
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

      // Only check coupon if ticket is paid
      if (ticketData.price > 0) {
        await checkCouponAvailability(ticketData.eventId, token);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : "Failed to load ticket information");
    }
  };

  const checkCouponAvailability = async (eventId: number, token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/payment/check-coupon/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check coupon status");
      }

      const couponData = await response.json();
       console.log('Coupon check response:', couponData);
      setCouponStatus(couponData);

      // Automatically disable coupon if not available
      if (!couponData.canUseCoupon || couponData.remainingCoupons <= 0) {
        setUseCoupon(false);
      }
    } catch (error) {
      console.error("Coupon check error:", error);
      setUseCoupon(false);
      setCouponStatus({
        canUseCoupon: false,
        couponUsageCount: 0,
        remainingCoupons: 0,
        message: "Failed to verify coupon availability",
      });
    }
  };

  const calculateTotalPrice = () => {
    if (!ticketData) return 0;
    let total = ticketData.price * quantity;

    // Apply points discount (fixed 10,000)
    if (usePoints && user?.points && user.points >= 10000) {
      total -= 10000;
    }

    // Apply coupon discount (10%)
    if (useCoupon && couponStatus.canUseCoupon) {
      total = total * 0.9;
    }

    return Math.max(0, total);
  };

  const handlePayment = async () => {
    if (!ticketId || !quantity || !ticketData) {
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

      // Verify coupon status one last time before proceeding
      if (!isFreeTicket && useCoupon) {
        const verifyStatus = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/payment/check-coupon/${ticketData.eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!verifyStatus.ok) {
          throw new Error("Coupon verification failed");
        }

        const couponVerification = await verifyStatus.json();
        if (!couponVerification.canUseCoupon) {
          throw new Error(couponVerification.message || "Coupon is no longer valid");
        }
      }

      // Create order
      const orderBody = {
        eventId: ticketData.eventId,
        ticketId: Number(ticketId),
        quantity: Number(quantity),
        totalPrice: ticketData.price * quantity,
        finalPrice: calculateTotalPrice(),
        usePoints: !isFreeTicket && usePoints,
        useCoupon: !isFreeTicket && useCoupon,
        status: isFreeTicket ? "PAID" : "PENDING"
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

      // Handle free tickets
      if (isFreeTicket) {
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/payment/success-email-order/${orderResult.data.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        router.push(`/payment/success?order_id=ORDER-${orderResult.data.id}`);
        return;
      }

      // Create payment for paid tickets
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
        throw new Error("Failed to initiate payment");
      }

      const paymentResult = await paymentResponse.json();
      if (paymentResult.data?.paymentUrl) {
        window.location.href = paymentResult.data.paymentUrl;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error instanceof Error ? error.message : "Payment processing failed");
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

  return (
    <div className="min-h-screen bg-black text-white py-12 pt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-zinc-900 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-8">
            {ticketData.price === 0 ? 'Order Details' : 'Payment Details'}
          </h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Ticket Information */}
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                {ticketData.event?.title}
              </h2>
              <div className="space-y-2">
                <p>Ticket Type: {ticketData.category}</p>
                <p>Quantity: {quantity}</p>
                <p>Price per ticket: {ticketData.price === 0 ? "Free" : formatPrice(ticketData.price)}</p>
              </div>
            </div>

            {/* Discounts Section */}
            {ticketData.price > 0 && (
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Available Discounts</h3>

                {/* Points Discount */}
                {user?.points && user.points >= 10000 && (
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p>Use Points Discount</p>
                      <p className="text-sm text-gray-400">
                        Available: {formatPrice(user.points)} pts
                      </p>
                    </div>
                    <Switch 
                      checked={usePoints} 
                      onCheckedChange={setUsePoints}
                    />
                  </div>
                )}

                {/* Coupon Discount */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className={!couponStatus.canUseCoupon ? "text-gray-500" : ""}>
                      Apply 10% Coupon Discount
                    </p>
                    {couponStatus.message ? (
                      <p className="text-sm text-red-400">{couponStatus.message}</p>
                    ) : couponStatus.canUseCoupon ? (
                      <p className="text-sm text-gray-400">
                        {couponStatus.remainingCoupons} coupons remaining for this event
                      </p>
                    ) : null}
                  </div>
                  <Switch
                    checked={useCoupon}
                    onCheckedChange={(checked) => {
                      if (!couponStatus.canUseCoupon && checked) return;
                      setUseCoupon(checked);
                    }}
                    disabled={!couponStatus.canUseCoupon}
                  />
                </div>
              </div>
            )}

            {/* Total Payment */}
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Total Payment</h3>
              <p className="text-2xl font-bold text-orange-500">
                {ticketData.price === 0 ? "Free" : formatPrice(calculateTotalPrice())}
              </p>
              {ticketData.price > 0 && (
                <div className="text-sm text-gray-400 mt-2">
                  {usePoints && <p>Points discount: -Rp 10,000</p>}
                  {useCoupon && <p>Coupon discount: -10%</p>}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 transition-colors"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : ticketData.price === 0 ? (
                "Confirm Free Order"
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
  redirectTo: "/not-authorized",
});