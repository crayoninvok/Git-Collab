"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/context/useSessionHook";
import { formatPrice } from "@/helpers/formatPrice";
import StatisticChart from "@/components/graph/statistiChart";
import { graphDataDaily } from "@/components/graph/dayData";
import { graphDataMonth } from "@/components/graph/monthData";
import AdminSidebar from "@/components/AdminSidebar";

import withGuard from "@/hoc/pageGuard";

const graphOptions = ["By Month", "By Year", "Per 5 Years"];

const analyticsData = [
  { title: "Your Event", value: 10, color: "text-orange-500" },
  { title: "Total Ticket Sold", value: 345, color: "text-orange-500" },
  { title: "Total Revenue", value: 450000000, color: "text-orange-500" },
  { title: "Profit", value: "90%", color: "text-orange-500" },
];

const LoadingState = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
    <h1 className="text-3xl font-bold">Loading...</h1>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
    <h1 className="text-3xl font-bold">{message}</h1>
  </div>
);

const AnalyticsCard = (props: (typeof analyticsData)[number]) => {
  const { title, value, color } = props;
  return (
    <div className="p-6 bg-gray-700 shadow-lg rounded-lg flex flex-col justify-between">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className={`mt-2 text-4xl font-bold ${color}`}>
        {title === "Total Revenue" && typeof value === "number"
          ? formatPrice(value)
          : value}
      </p>
    </div>
  );
};

function DashboardPage() {
  const { promotor, checkSession } = useSession();
  const [loading, setLoading] = useState(true);
  const [selectedGraph, setSelectedGraph] = useState<string>("By Month");

  useEffect(() => {
    const initializeSession = async () => {
      try {
        await checkSession();
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, [checkSession]);

  if (loading) return <LoadingState />;
  if (!promotor) return <ErrorState message="No Promotor Data Found" />;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <AdminSidebar />
      <main className="flex-1 px-6 bg-gradient-to-b from-gray-800 to-gray-950">
        {/* Header */}

        <header className="mb-6 flex flex-col lg:flex-row justify-between items-center p-10">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-white">
              Welcome to the Promotor Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Your activity overview</p>
          </div>
          <div className="flex items-center space-x-5 mt-4 lg:mt-0">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-green-400 shadow-lg">
              <Image
                src={promotor.avatar || "/placeholder.png"}
                alt={promotor.name || "Profile Picture"}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">
                {promotor.name}
              </h1>
              <p className="text-gray-400">{promotor.email}</p>
              <p className="text-gray-400">Event Promotor</p>
            </div>
          </div>
        </header>

        {/* Analytics Section */}

        <section className="mb-10">
          <h1 className="text-3xl font-bold text-white">Overview</h1>
          <hr className="border-gray-700 my-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.map((data, index) => (
              <AnalyticsCard key={index} {...data} />
            ))}
          </div>
        </section>

        {/* Graph Section */}

        <section>
          <h1 className="text-center text-3xl font-bold text-white">
            Statistic Graph
          </h1>
          <div className="my-6 text-center">
            <label htmlFor="graphSelector" className="sr-only">
              Select Graph
            </label>

            <select
              id="graphSelector"
              value={selectedGraph}
              onChange={(e) => setSelectedGraph(e.target.value)}
              className="p-3 bg-gray-700 text-white rounded-md shadow-lg"
            >
              {graphOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-[1700px] h-[600px] mx-auto">
              {selectedGraph === "By Year" && (
                <StatisticChart data={graphDataMonth} selectedGraph="By Year" />
              )}
              {selectedGraph === "By Month" && (
                <StatisticChart
                  data={graphDataDaily}
                  selectedGraph="By Month"
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default withGuard(DashboardPage, {
  requiredRole: "promotor",
  redirectTo: "/login",
});
