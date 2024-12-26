import { ChartData } from "./statisticChartTypes";

// Number of days in each month (non-leap year)
const daysInMonth = [
  31, // January
  28, // February
  31, // March
  30, // April
  31, // May
  30, // June
  31, // July
  31, // August
  30, // September
  31, // October
  30, // November
  31, // December
];

// Monthly revenue data
const monthlyRevenue = [
  2000000, 3000000, 2500000, 4000000, 2000000, 3000000, 2500000, 4000000,
  2000000, 3000000, 2500000, 4000000,
];

// Generate day-based data
const generateDailyRevenueData = () => {
  const labels: string[] = [];
  const revenue: number[] = [];

  monthlyRevenue.forEach((monthRevenue, monthIndex) => {
    const days = daysInMonth[monthIndex];
    const dailyRevenue = Math.round(monthRevenue / days);

    for (let day = 1; day <= days; day++) {
      labels.push(
        `Day ${day}, ${new Date(2024, monthIndex).toLocaleString('default', { month: 'long' })}`
      );
      revenue.push(dailyRevenue);
    }
  });

  return { labels, revenue };
};

const { labels, revenue } = generateDailyRevenueData();

export const graphDataDaily: ChartData = {
  labels, // Day-wise labels
  participants: new Array(labels.length).fill(0), // Placeholder for participant data
  revenue, // Revenue per day
};
