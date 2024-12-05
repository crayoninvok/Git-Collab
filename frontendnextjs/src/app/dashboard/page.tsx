import AdminSidebar from "@/components/AdminSidebar";
import Link from "next/link";

export default function DashboardPage() {
  const analyticsData = [
    { title: "Our Event", value: "1,234", color: "text-blue-500" },
    { title: "Attendance", value: "345", color: "text-green-500" },
    { title: "Transactions", value: "$12,345", color: "text-yellow-500" },
    { title: "Event Statistic", value: "$12,345", color: "text-yellow-500" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Welcome to the Promotor Dashboard</h1>
          <p className="text-gray-600 mt-2">Your summary at a glance</p>
        </header>

        {/* Analytics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsData.map((data, index) => (
            <div key={index} className="p-6 bg-white shadow rounded-lg">
              <h2 className="text-xl font-bold">{data.title}</h2>
              <p className={`mt-2 text-4xl font-bold ${data.color}`}>
                {data.value}
              </p>
              {data.title === "Total Ticket" && (
                <Link href="/dashboard/totalticket"> <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  See More...
                </button></Link>
              )}
              {data.title === "Active Sessions" && (
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  See More...
                </button>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
