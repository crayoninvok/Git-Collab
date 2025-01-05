"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/shadui/chart";
import { chartData } from "./data";

// Data for the chart


// Configuration for the chart
//Birutua desktop
//Biru muda mobile
const chartConfig = {
  mobil: {
    label: "Desktop",
    color: "#2563eb",
  },
  motor: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

// Main component for rendering the chart
export default function TableGraph() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full items-center">
      <LineChart accessibilityLayer data={chartData}>
        {/* Grid lines for better readability */}
        <CartesianGrid vertical={false} />

        {/* X-axis configuration */}
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)} 
        />

        {/* Y-axis configuration */}
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={40} // Adjust width to prevent overlap
        />

        {/* Bars for Desktop and Mobile data */}
        <Line dataKey="mobil" fill="var(--color-desktop)" radius={4} />
        <Line dataKey="motor" fill="var(--color-mobile)" radius={4} />
      </LineChart>
    </ChartContainer>
  );
}
