"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Image from "next/image";
import TableGraph from "@/components/TableGraph";
import { useSession } from "@/context/useSession";
import { formatPrice } from "@/helpers/formatPrice";

export default function DashboardPage() {
  const { promotor, checkSession } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkSession();
      } catch (err) {
        console.error("Failed to fetch promotor session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (!promotor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold">No Promotor Data Found</h1>
      </div>
    );
  }

  const analyticsData = [
    { title: "Your Event", value: "10", color: "text-orange-500" }, // Count of events
    { title: "Total Ticket Sold", value: "345", color: "text-orange-500" }, // Count of tickets
    { title: "Total Revenue", value: 450000000, color: "text-orange-500" }, // Revenue (price)
    { title: "Profit", value: "90%", color: "text-orange-500" }, // Profit as percentage
  ];

  return (
    <div className="flex min-h-screen lg:flex-row bg-gray-900 text-white">
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
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-400 shadow-lg relative">
              <Image
                src={promotor.avatar || "/placeholder.png"}
                alt={promotor.name || "profile picture"}
                layout="fill" // Makes the image fill the parent container
                objectFit="cover" // Ensures the image covers the container proportionally
              />
            </div>
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
                {data.title === "Total Revenue" &&
                typeof data.value === "number"
                  ? formatPrice(data.value) // Format price for Total Revenue
                  : data.value}{" "}
                {/* Display value as is for other fields */}
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
