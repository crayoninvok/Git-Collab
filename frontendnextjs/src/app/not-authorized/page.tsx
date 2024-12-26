"use client";

import { useRouter } from "next/navigation";

export default function NotAuthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
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
