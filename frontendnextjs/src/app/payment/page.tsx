"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/helpers/formatPrice";
import { useSession } from "@/context/useSessionHook";
import { PaymentData } from "@/types/event";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axios from 'axios';

export default function PaymentPage() {
 const { user, isAuth, loading } = useSession();
 const router = useRouter();
 const searchParams = useSearchParams();

 const [totalPrice, setTotalPrice] = useState(0);
 const [finalPrice, setFinalPrice] = useState(0);
 const [pointsToRedeem, setPointsToRedeem] = useState(0);
 const [redeemedPoints, setRedeemedPoints] = useState(0);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");
 const [isProcessing, setIsProcessing] = useState(false);
 const [originalPrice, setOriginalPrice] = useState(0);

 useEffect(() => {
   if (!loading && !isAuth) {
     router.push("/login");
   }
 }, [isAuth, loading, router]);

 useEffect(() => {
   if (!isAuth || !user) return;

   const total = Number(searchParams.get("total")) || 0;
   const quantity = Number(searchParams.get("quantity")) || 0;

   if (!total || !quantity) {
     router.push("/");
     return;
   }

   setTotalPrice(total);
   setOriginalPrice(total);
   calculateFinalPrice(total);
 }, [searchParams, isAuth, user]);

 const calculateFinalPrice = (basePrice: number) => {
   if (!user) return;

   let final = basePrice;

   if (user.percentage && user.userCoupon) {
     const currentDate = new Date();
     const expiryDate = new Date(user.userCoupon);

     if (currentDate < expiryDate) {
       const discountAmount = basePrice * (user.percentage / 100);
       final -= discountAmount;
       setSuccess(`${user.percentage}% discount applied automatically!`);
     }
   }

   setFinalPrice(final);
 };

 const handlePointsRedeem = () => {
   if (!user) return;
   setError("");

   const availablePoints = user.points - redeemedPoints;

   if (pointsToRedeem % 10000 !== 0) {
     setError("Points must be in multiples of 10,000");
     return;
   }

   if (pointsToRedeem > availablePoints) {
     setError("Not enough points available");
     return;
   }

   if (pointsToRedeem > finalPrice) {
     setError("Points value cannot exceed remaining payment amount");
     return;
   }

   let basePrice = originalPrice;
   if (user.percentage && user.userCoupon) {
     const currentDate = new Date();
     const expiryDate = new Date(user.userCoupon);

     if (currentDate < expiryDate) {
       basePrice = originalPrice - (originalPrice * (user.percentage / 100));
     }
   }

   const pointsValue = pointsToRedeem;
   setFinalPrice(basePrice - pointsValue);
   setRedeemedPoints((prev) => prev + pointsToRedeem);
   setSuccess("Points redeemed successfully!");
   setError("");
   setPointsToRedeem(0);
 };

 const handlePayment = async () => {
   if (!user) return;
   setIsProcessing(true);
   setError("");

   try {
     const token = localStorage.getItem('token');
     const paymentData: PaymentData = {
       ticketId: Number(searchParams.get("ticketId")),
       quantity: Number(searchParams.get("quantity")),
       totalPrice,
       finalPrice,
       pointsRedeemed: redeemedPoints || undefined,
       percentage: user.percentage || undefined,
     };

     const response = await axios.post('http://localhost:8000/api/orders', paymentData, {
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
       },
       withCredentials: true
     });

     router.push(`/payment-confirmation/${response.data.orderId}`);
   } catch (err) {
     if (axios.isAxiosError(err)) {
       setError(err.response?.data?.message || "Payment failed");
     } else {
       setError("An unexpected error occurred");
     }
   } finally {
     setIsProcessing(false);
   }
 };

 if (loading) {
   return (
     <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
       <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
     </div>
   );
 }

 if (!user) return null;

 return (
   <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
     <div className="max-w-2xl mx-auto space-y-6">
       <h1 className="text-3xl font-bold">Payment Details</h1>

       <Card className="bg-zinc-900 border-zinc-800">
         <CardHeader>
           <CardTitle>Price Summary</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="flex justify-between items-center">
             <span className="text-zinc-400">Total Price:</span>
             <span className="text-xl">{formatPrice(totalPrice)}</span>
           </div>
           
           {user.percentage && user.userCoupon && (
             <div className="flex justify-between items-center text-green-400">
               <span>Discount ({user.percentage}%):</span>
               <span>- {formatPrice(totalPrice * (user.percentage / 100))}</span>
             </div>
           )}
           
           {redeemedPoints > 0 && (
             <div className="flex justify-between items-center text-orange-400">
               <span>Points Redeemed:</span>
               <span>- {formatPrice(redeemedPoints)}</span>
             </div>
           )}
           
           <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
             <span className="text-zinc-400">Final Price:</span>
             <span className="text-2xl font-bold text-orange-500">
               {formatPrice(finalPrice)}
             </span>
           </div>
         </CardContent>
       </Card>

       <Card className="bg-zinc-900 border-zinc-800">
         <CardHeader>
           <CardTitle>Redeem Points</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           <p className="text-zinc-400">
             Available Points: {(user.points - redeemedPoints).toLocaleString()}
           </p>
           
           {redeemedPoints > 0 && (
             <p className="text-orange-400">
               Points Redeemed: {redeemedPoints.toLocaleString()}
             </p>
           )}
           
           <div className="flex gap-4">
             <Input
               type="number"
               value={pointsToRedeem || ""}
               onChange={(e) => setPointsToRedeem(Number(e.target.value))}
               placeholder="Enter points (multiples of 10,000)"
               className="bg-zinc-800 border-zinc-700 text-white"
               step="10000"
               min="0"
               max={user.points - redeemedPoints}
               disabled={isProcessing}
             />
             <Button
               onClick={handlePointsRedeem}
               className="bg-orange-500 hover:bg-orange-600 text-white"
               disabled={isProcessing || !pointsToRedeem || pointsToRedeem > (user.points - redeemedPoints)}
             >
               Redeem
             </Button>
           </div>
         </CardContent>
       </Card>

       {error && (
         <Alert variant="destructive">
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       )}
       
       {success && (
         <Alert className="bg-green-500/20 text-green-400 border-green-500/50">
           <AlertDescription>{success}</AlertDescription>
         </Alert>
       )}

       <Button
         onClick={handlePayment}
         className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg"
         disabled={isProcessing}
       >
         {isProcessing ? (
           <div className="flex items-center gap-2">
             <Loader2 className="h-5 w-5 animate-spin" />
             Processing...
           </div>
         ) : (
           "Pay Now"
         )}
       </Button>
     </div>
   </div>
 );
}