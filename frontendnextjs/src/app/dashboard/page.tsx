"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/context/useSessionHook";
import { formatPrice } from "@/helpers/formatPrice";
import AdminSidebar from "@/components/adminSidebarDashboard";
import withGuard from "@/hoc/pageGuard";
import RevenueGraph from "../../components/graph/revenueGraphSort";


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

const AnalyticsCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) => (
  <div className="p-6 bg-gray-700 shadow-lg rounded-lg flex flex-col justify-between">
    <h2 className="text-xl font-bold text-white">{title}</h2>
    <p className={`mt-2 text-4xl font-bold ${color}`}>
      {title === "Total Revenue" && typeof value === "number"
        ? formatPrice(value)
        : value}
    </p>
  </div>
);

function DashboardPage() {
  const { promotor, checkSession } = useSession();
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<
    { title: string; value: number | string; color: string }[]
  >([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in again.");

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

      
        const [
          totalResponse,
          activeResponse,
          deactiveResponse,
          revenueResponse,
        ] = await Promise.all([
          fetch(`${base_url}/dashboard/getAllEvent`, {
            method: "GET",
            headers,
          }),
          fetch(`${base_url}/dashboard/getActiveEvent`, {
            method: "GET",
            headers,
          }),
          fetch(`${base_url}/dashboard/getDeactiveEvent`, {
            method: "GET",
            headers,
          }),
          fetch(`${base_url}/dashboard/getTotalRevenue`, {
            method: "GET",
            headers,
          }),
        ]);

        if (
          !totalResponse.ok ||
          !activeResponse.ok ||
          !deactiveResponse.ok ||
          !revenueResponse.ok
        ) {
          throw new Error("Failed to fetch analytics data.");
        }

        const [totalData, activeData, deactiveData, revenueData] =
          await Promise.all([
            totalResponse.json(),
            activeResponse.json(),
            deactiveResponse.json(),
            revenueResponse.json(),
          ]);

        setAnalyticsData([
          {
            title: "Your Event",
            value: totalData.totalEvents || 0,
            color: "text-blue-500",
          },
          {
            title: "Active Events",
            value: activeData.activeEvents || 0,
            color: "text-green-500",
          },
          {
            title: "Deactive Events",
            value: deactiveData.deactiveEvents || 0,
            color: "text-red-500",
          },
          {
            title: "Total Revenue",
            value: revenueData.totalRevenue,
            color: "text-orange-500",
          },
        ]);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError((error as Error).message || "Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

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
    fetchAnalytics();
  }, [base_url, checkSession]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!promotor) return <ErrorState message="No Promotor Data Found" />;

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-black via-gray-800 to-gray-950 text-white">
      <AdminSidebar />
      <main className="flex-1 px-6bg-gradient-to-r from-black via-gray-800 to-gray-900">
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
          <h1 className="text-3xl font-bold text-white ml-[5rem]">Overview</h1>
          <hr className="border-gray-700 my-4" />
          <div className="mx-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.map((data, index) => (
              <AnalyticsCard key={index} {...data} />
            ))}
          </div>
        </section>

        {/* Graph Section */}

        <div className="flex items-center justify-center">
          <RevenueGraph />
        </div>
      </main>
    </div>
  );
}

export default withGuard(DashboardPage, {
  requiredRole: "promotor",
  redirectTo: "/not-authorized-dashboard",
});
