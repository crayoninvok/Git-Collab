'use client'

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState({
    eventId: 0,
    tickets: [],
    quantity: 0,
    totalPrice: 0
  });
  
  const [userInfo, setUserInfo] = useState({
    points: 0,
    percentage: 0,
    userCouponId: null,
    userCouponExpiry: null
  });
  
  const [pointsToUse, setPointsToUse] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const initializePage = async () => {
      try {
        const savedOrder = localStorage.getItem('pendingOrder');
        if (!savedOrder) {
          toast.error('No order details found');
          router.push('/');
          return;
        }
        setOrderDetails(JSON.parse(savedOrder));

        // Fetch user session for points and coupon info
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/auth/session`, {
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to fetch user session');
        
        const data = await response.json();
        setUserInfo({
          points: data.points || 0,
          percentage: data.percentage || 0,
          userCouponId: data.userCouponId || null,
          userCouponExpiry: data.userCoupon || null
        });
      } catch (err) {
        setError('Error initializing payment page');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [router]);

  // Points validation and handling
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value <= userInfo.points && value % 10000 === 0 && value >= 0) {
      setPointsToUse(value);
    }
  };

  // Calculate final price with discounts
  const calculateFinalPrice = () => {
    let finalPrice = orderDetails.totalPrice;
    
    // Apply points discount if used
    if (pointsToUse > 0) {
      finalPrice -= pointsToUse;
    }
    
    // Apply coupon discount if available and valid
    if (userInfo.percentage > 0 && userInfo.userCouponExpiry) {
      const couponExpiry = new Date(userInfo.userCouponExpiry);
      if (couponExpiry > new Date()) {
        finalPrice = finalPrice * (1 - userInfo.percentage / 100);
      }
    }
    
    return Math.max(0, Math.round(finalPrice));
  };

  const handlePayment = async () => {
    try {
      setProcessingPayment(true);
      const finalPrice = calculateFinalPrice();
      
      const orderPayload = {
        eventId: orderDetails.eventId,
        totalPrice: orderDetails.totalPrice,
        finalPrice: finalPrice,
        pointsUsed: pointsToUse,
        userCouponId: userInfo.userCouponId,
        details: {
          quantity: orderDetails.quantity,
          tickets: orderDetails.tickets.map(ticket => ({
            id: ticket.id,
            quantity: ticket.quantity
          }))
        }
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/payment/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const { orderId, midtransToken } = await response.json();
      
      window.snap.pay(midtransToken, {
        onSuccess: async () => {
          try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/payment/orders/${orderId}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ status: 'PAID' })
            });
            
            localStorage.removeItem('pendingOrder');
            toast.success('Payment successful!');
            router.push('/orders');
          } catch (error) {
            toast.error('Error updating payment status');
          }
        },
        onPending: () => {
          toast.info('Complete your payment');
        },
        onError: () => {
          toast.error('Payment failed');
          setProcessingPayment(false);
        },
        onClose: () => {
          setProcessingPayment(false);
          toast.info('Payment window closed');
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setProcessingPayment(false);
    }
  };

  return (
    <>
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
      
      <div className="min-h-screen bg-black p-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-zinc-900 text-white border-zinc-800 rounded-lg p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Payment Details</h1>
            </div>
            
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="rounded-lg bg-zinc-800 p-4">
                <h3 className="text-lg font-medium mb-3">Order Summary</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Total Price</span>
                    <span>{new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    }).format(orderDetails.totalPrice)}</span>
                  </div>
                  
                  {pointsToUse > 0 && (
                    <div className="flex justify-between text-orange-400">
                      <span>Points Discount</span>
                      <span>-{new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR'
                      }).format(pointsToUse)}</span>
                    </div>
                  )}
                  
                  {userInfo.percentage > 0 && userInfo.userCouponExpiry && (
                    <div className="flex justify-between text-orange-400">
                      <span>Coupon Discount (10%)</span>
                      <span>-{new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR'
                      }).format(orderDetails.totalPrice * 0.1)}</span>
                    </div>
                  )}

                  <div className="border-t border-zinc-700 pt-2 mt-2">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Final Price</span>
                      <span className="text-orange-400">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR'
                        }).format(calculateFinalPrice())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points Section */}
              {userInfo.points > 0 && (
                <div className="rounded-lg bg-zinc-800 p-4">
                  <h3 className="text-lg font-medium mb-3">Use Points</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Available Points: {new Intl.NumberFormat('id-ID').format(userInfo.points)}
                    </p>
                    <div>
                      <input
                        type="number"
                        value={pointsToUse}
                        onChange={handlePointsChange}
                        step="10000"
                        min="0"
                        max={userInfo.points}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-2 text-white"
                        placeholder="Enter points (multiple of 10,000)"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Points must be in multiples of 10,000 (10,000 points = Rp 10,000 discount)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Coupon Section */}
              {userInfo.percentage > 0 && userInfo.userCouponExpiry && (
                <div className="rounded-lg bg-zinc-800 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">Available Coupon</h3>
                      <p className="text-sm text-gray-400">
                        10% discount on total price
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Expires: {new Date(userInfo.userCouponExpiry).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-orange-400">
                      Applied
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={processingPayment}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  processingPayment 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {processingPayment ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;