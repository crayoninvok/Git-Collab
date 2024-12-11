"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function VerifyPage({ params }: { params: { token: string } }) {
  const router = useRouter();

  const onVerify = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/auth/verify/${params.token}`,
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
    }
  };

  useEffect(() => {
    onVerify();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-lg font-semibold text-gray-600">
        Verifying your account, please wait...
      </p>
    </div>
  );
}
