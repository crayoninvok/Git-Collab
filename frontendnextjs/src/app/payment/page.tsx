// app/payment/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PaymentPage from '@/components/payment/payment';
import { IUser } from '@/types/event';  

export default function Payment() {
  const searchParams = useSearchParams();
  const [userDetails, setUserDetails] = useState<IUser | null>(null);
  
  useEffect(() => {
    // Load Midtrans Snap
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
    document.body.appendChild(script);

    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/auth/session', {
          credentials: 'include'
        });
        const data: IUser = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <PaymentPage
      eventId={Number(searchParams.get('eventId'))}
      ticketId={Number(searchParams.get('ticketId'))}
      quantity={Number(searchParams.get('quantity'))}
      basePrice={Number(searchParams.get('price'))}
      userPoints={userDetails.points}
      hasCoupon={!!userDetails.percentage}
      couponExpiry={userDetails.userCoupon?.expiredAt || null}
    />
  );
}