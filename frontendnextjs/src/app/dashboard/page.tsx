import AdminSidebar from "@/components/AdminSidebar";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
          <p className="text-gray-600 mt-2">Your summary at a glance</p>
        </header>

        {/* Analytics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold">Total Users</h2>
            <p className="mt-2 text-4xl font-bold text-blue-500">1,234</p>
          </div>

          {/* Active Sessions */}
          <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold">Active Sessions</h2>
            <p className="mt-2 text-4xl font-bold text-green-500">345</p>
          </div>

          {/* Revenue */}
          <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold">Revenue</h2>
            <p className="mt-2 text-4xl font-bold text-yellow-500">$12,345</p>
          </div>
        </section>
      </div>
    </div>
  );
}
