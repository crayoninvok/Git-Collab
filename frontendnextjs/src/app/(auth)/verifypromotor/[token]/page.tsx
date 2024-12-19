"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VerifyPage({ params }: { params?: { token?: string } }) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE

  const onVerify = async () => {
    if (isVerifying) return;
    setIsVerifying(true);

    if (!params?.token) {
      toast.error("Invalid verification token.");
      router.push("/");
      return;
    }

    try {
      const res = await fetch(
        `${base_url}/auth/verifypromotor/${params.token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Verification failed");
      }

      const result = await res.json();
      toast.success(result.message || "Account successfully verified!");
      router.push("/login/loginpromotor");
    } catch (err: any) {
      console.error("Verification Error:", err);
      toast.error(err.message || "Verification failed! Please try again.");
      router.push("/");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    onVerify();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <p className="text-lg font-semibold text-gray-600">
        Verifying your account, please wait...
      </p>
    </div>
  );
}
