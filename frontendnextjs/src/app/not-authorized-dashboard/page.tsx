"use client";

import { useRouter } from "next/navigation";
import { AiOutlineStop } from "react-icons/ai";


export default function NotAuthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-bl from-black to-gray-900 text-white">
     <AiOutlineStop className="w-[100px] h-[100px] mb-5 text-red-500" />
      <h1 className="text-4xl font-bold mb-4">403 - Not Authorized</h1>
      <p className="text-lg mb-6">
        You do not have permission to access this page.
      </p>
      <button
        className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600"
        onClick={() => router.push("/")}
      >
        Go Back to Home
      </button>
    </div>
  );
}