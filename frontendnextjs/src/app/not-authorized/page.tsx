"use client";

import { useRouter } from "next/navigation";
import { ImHome } from "react-icons/im";



export default function NotAuthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-bl from-black to-gray-900 text-white">
     <ImHome className="w-[100px] h-[100px] mb-5 text-orange-600" />
      <h1 className="text-4xl font-bold mb-4">403 - Sorry</h1>
      <p className="text-lg mb-6">
        Please login to make payment.
      </p>
      <button
        className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600"
        onClick={() => router.push("/login/loginuser")}
      >
        Back to Login
      </button>
    </div>
  );
}