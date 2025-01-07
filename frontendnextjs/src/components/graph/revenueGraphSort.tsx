import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueGraph: React.FC = () => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [graphData, setGraphData] = useState<{
    labels: string[];
    data: number[];
  }>({
    labels: [],
    data: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const fetchRevenueData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authorization token found");

      const response = await fetch(
        `${base_url}/dashboard/getgrouprevenue?period=${period}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch revenue data");

      const result = await response.json();
      const labels = result.groupedRevenue.map(
        (item: { period: string }) => item.period
      );
      const data = result.groupedRevenue.map(
        (item: { totalRevenue: number }) => item.totalRevenue
      );

      setGraphData({ labels, data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [period]);

  const handlePeriodChange = (newPeriod: "week" | "month" | "year") => {
    setPeriod(newPeriod);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Revenue Graph</h2>
      <div className="flex justify-center gap-6 mb-8">
        <button
          onClick={() => handlePeriodChange("week")}
          className={`px-6 py-3 text-lg font-bold rounded-lg transition ${
            period === "week"
              ? "bg-blue-600 text-white shadow-lg scale-110"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => handlePeriodChange("month")}
          className={`px-6 py-3 text-lg font-bold rounded-lg transition ${
            period === "month"
              ? "bg-blue-600 text-white shadow-lg scale-110"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Month
        </button>
        <button
          onClick={() => handlePeriodChange("year")}
          className={`px-6 py-3 text-lg font-bold rounded-lg transition ${
            period === "year"
              ? "bg-blue-600 text-white shadow-lg scale-110"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Year
        </button>
      </div>

      <div className="flex items-center justify-center w-full">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : !graphData.labels.length ? (
          <p>No revenue data available for the selected period.</p>
        ) : (
          <div className="w-[50vw] h-[35vh]">
            <Line
              data={{
                labels: graphData.labels,
                datasets: [
                  {
                    label: `Revenue (${period})`,
                    data: graphData.data,
                    fill: true, 
                    backgroundColor: "rgba(75,192,192,0.2)", 
                    borderColor: "rgba(75,192,192,1)", 
                    pointBorderColor: "rgba(75,192,192,1)", 
                    pointBackgroundColor: "rgba(255,255,255,1)", 
                    tension: 0.3, 
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                    labels: {
                      color: "rgba(75,192,192,1)", 
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "rgba(75,192,192,1)", // X-axis tick color
                    },
                    grid: {
                      color: "rgba(200,200,200,0.3)", // X-axis gridline color
                    },
                  },
                  y: {
                    ticks: {
                      color: "rgba(75,192,192,1)", // Y-axis tick color
                    },
                    grid: {
                      color: "rgba(200,200,200,0.3)", // Y-axis gridline color
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueGraph;
