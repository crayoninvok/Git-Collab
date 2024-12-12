"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Image from "next/image";
import TableGraph from "@/components/TableGraph";
import { useSession } from "@/context/useSessionPromotor";

export default function DashboardPage() {
  const { promotor, checkSession } = useSession(); // Ensure `checkSession` is exposed in the context
  const [loading, setLoading] = useState(true); // Local loading state

  // Fetch session data on component mount
  useEffect(() => {
    const fetchData = async () => {
      await checkSession(); // Refresh session state
      setLoading(false); // Disable loading after data is fetched
    };

    fetchData();
  }, [checkSession]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  // If `promotor` is still not available, display an error
  if (!promotor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold">No Promotor Data Found</h1>
      </div>
    );
  }

  const analyticsData = [
    { title: "Your Event", value: "10", color: "text-orange-500" },
    { title: "Total Ticket Sold", value: "345", color: "text-orange-500" },
    {
      title: "Total Revenue",
      value: "Rp.450000000",
      color: "text-orange-500",
    },
    { title: "Profit", value: "90%", color: "text-orange-500" },
  ];

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-gray-900 text-white">
      {/* Sidebar */}
      <AdminSidebar />

      <div className="flex-1 px-6 bg-gray-800">
        <div className="mb-6 flex justify-between items-center flex-col lg:flex-row p-10">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-white">
              Welcome to the Promotor Event Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Your summary at a glance</p>
          </div>
          <div className="flex items-center space-x-5 mt-4 lg:mt-0">
            <Image
              src={promotor.avatar || "/placeholder.png"}
              alt={promotor.name || "profile picture"}
              width={80}
              height={80}
              className="rounded-full border-green-400 shadow-lg border-2 object-cover"
            />
            <div>
              <h1 className="font-extrabold text-xl text-white">
                {promotor.name}
              </h1>
              <h1 className="text-gray-400">{promotor.email}</h1>
              <h2 className="text-gray-400">Event Promotor</h2>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <hr className="border-b border-gray-700 my-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsData.map((data, index) => (
            <div
              key={index}
              className="p-6 bg-gray-700 shadow-lg rounded-lg flex flex-col justify-between"
            >
              <h2 className="text-xl font-bold text-white">{data.title}</h2>
              <p className={`mt-2 text-4xl font-bold ${data.color}`}>
                {data.value}
              </p>
            </div>
          ))}
        </div>
        <h1 className="mt-10 text-center text-3xl text-white">
          Statistic Graph
        </h1>
        <div className="w-full max-w-[1000px] h-[600px] mx-auto my-10">
          <TableGraph />
        </div>
      </div>
    </div>
  );
}
