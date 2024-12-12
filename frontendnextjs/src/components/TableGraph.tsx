"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/shadui/chart";

// Data for the chart
const chartData = [
  { month: "January", desktop: 250, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

// Configuration for the chart
//Birutua desktop
//Biru muda mobile
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

// Main component for rendering the chart
export default function TableGraph() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        {/* Grid lines for better readability */}
        <CartesianGrid vertical={false} />

        {/* X-axis configuration */}
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)} // Shorten month names
        />

        {/* Y-axis configuration */}
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={40} // Adjust width to prevent overlap
        />

        {/* Bars for Desktop and Mobile data */}
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
