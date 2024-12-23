import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PaymentPageProps {
  eventId: number;
  ticketId: number;
  quantity: number;
  basePrice: number;
  userPoints?: number;
  hasCoupon?: boolean;
  couponExpiry?: string | null;
}

interface MidtransResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ 
  eventId,
  ticketId,
  quantity,
  basePrice,
  userPoints = 0,
  hasCoupon = false,
  couponExpiry = null
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [pointsToUse, setPointsToUse] = useState<number>(0);
  const [useCoupon, setUseCoupon] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(basePrice * quantity);
  const [finalPrice, setFinalPrice] = useState<number>(basePrice * quantity);

  useEffect(() => {
    let discountedPrice = totalPrice;
    
    if (pointsToUse > 0) {
      discountedPrice -= pointsToUse;
    }
    
    if (useCoupon && hasCoupon) {
      discountedPrice = discountedPrice * 0.9;
    }
    
    setFinalPrice(discountedPrice);
  }, [totalPrice, pointsToUse, useCoupon, hasCoupon]);

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value) || 0;
    if (points > userPoints) {
      toast({
        title: "Error",
        description: "You don't have enough points",
        variant: "destructive"
      });
      return;
    }
    
    if (points % 10000 !== 0) {
      toast({
        title: "Error",
        description: "Points must be in multiples of 10,000",
        variant: "destructive"
      });
      return;
    }
    
    setPointsToUse(points);
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          eventId,
          ticketId,
          quantity,
          usePoints: pointsToUse > 0,
          useCoupon,
          totalPrice,
          finalPrice,
        }),
      });

      const data = await response.json();
      
      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: function(result: MidtransResult) {
            toast({
              title: "Payment Successful",
              description: "Your ticket has been booked!",
            });
            router.push('/tickets');
          },
          onPending: function(result: MidtransResult) {
            toast({
              title: "Payment Pending",
              description: "Please complete your payment",
            });
          },
          onError: function(result: MidtransResult) {
            toast({
              title: "Payment Failed",
              description: "Please try again",
              variant: "destructive"
            });
          },
          onClose: function() {
            toast({
              title: "Payment Cancelled",
              description: "You closed the payment window",
            });
          }
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Use Points (Available: {userPoints})</label>
            <Input
              type="number"
              step="10000"
              min="0"
              max={userPoints}
              value={pointsToUse}
              onChange={handlePointsChange}
              placeholder="Enter points in multiples of 10,000"
            />
          </div>

          {hasCoupon && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useCoupon}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUseCoupon(e.target.checked)}
                id="useCoupon"
              />
              <label htmlFor="useCoupon">Use 10% discount coupon</label>
              {couponExpiry && (
                <span className="text-sm text-gray-500">
                  (Expires: {new Date(couponExpiry).toLocaleDateString()})
                </span>
              )}
            </div>
          )}

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rp {totalPrice.toLocaleString()}</span>
            </div>
            {pointsToUse > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Points Discount:</span>
                <span>-Rp {pointsToUse.toLocaleString()}</span>
              </div>
            )}
            {useCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount (10%):</span>
                <span>-Rp {(totalPrice * 0.1).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Final Price:</span>
              <span>Rp {finalPrice.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={handlePayment}
          >
            Pay Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentPage;