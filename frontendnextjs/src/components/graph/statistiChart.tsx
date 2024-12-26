import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { ChartData } from "./statisticChartTypes";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticChart: React.FC<{ data: ChartData; selectedGraph: string }> = ({
  data,
  selectedGraph,
}) => {
  // Data for Bar Chart (Participant)
  const participantData = {
    labels: data.labels,
    datasets: [
      {
        label: "Participants",
        data: data.participants,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Data for Line Chart (Income)
  const incomeData = {
    labels: data.labels,
    datasets: [
      {
        label: "Income",
        data: data.revenue,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        tension: 0.4, // Add curve to the line
      },
    ],
  };

  const optionsBar = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const optionsLine = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Only show participant graph if the selected graph is not "By Day" */}
      {selectedGraph !== "By Month" && (
        <div>
          <h2 className="text-lg font-bold mb-4 ">Participants per Event</h2>
          <Bar data={participantData} options={optionsBar} />
        </div>
      )}
      <div>
        <h2 className="text-lg font-bold mb-4">Income per Event</h2>
        <Line data={incomeData} options={optionsLine} />
      </div>
    </div>
  );
};

export default StatisticChart;
