import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, FileText, CreditCard, Settings, LogOut,
  GraduationCap, ChevronRight
} from "lucide-react";
import StatCard from "../../components/shared/StatCard";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "User Management", icon: Users, path: "/admin/users" },
  { label: "Applications", icon: FileText, path: "/admin/applications" },
  { label: "Admissions", icon: GraduationCap, path: "/admin/admissions" },
  { label: "Payments", icon: CreditCard, path: "/admin/payments" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function UniversityAdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-primary-900 to-primary-800 text-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-primary-700 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">University Admin</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-primary-900 to-primary-800 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-y-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-primary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-700 font-bold text-xl">S</span>
              </div>
              <div>
                <p className="text-white font-bold">S University</p>
                <p className="text-primary-200 text-xs">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary-100 hover:bg-primary-700 hover:text-white transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm flex-1 text-left">{item.label}</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-primary-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary-100 hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Desktop Header */}
        <div className="hidden lg:block bg-gradient-to-r from-primary-900 to-primary-800 text-white py-6 px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">University Admin Dashboard</h1>
              <p className="text-primary-200">Manage users, applications, and admissions</p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Users"
              value="1,234"
              icon={Users}
              color="blue"
              subtitle="+12% from last month"
            />
            <StatCard
              title="Active Applications"
              value="456"
              icon={FileText}
              color="green"
              subtitle="+8% from last month"
            />
            <StatCard
              title="Total Admissions"
              value="789"
              icon={GraduationCap}
              color="purple"
              subtitle="+15% from last month"
            />
            <StatCard
              title="Revenue"
              value="₹45.2L"
              icon={CreditCard}
              color="yellow"
              subtitle="+20% from last month"
            />
          </div>

          {/* Quick Actions */}
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/admin/users")}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
              >
                <Users className="w-6 h-6 text-primary-600 mb-2" />
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-500">Add, edit, or remove users</p>
              </button>
              <button
                onClick={() => navigate("/admin/applications")}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
              >
                <FileText className="w-6 h-6 text-primary-600 mb-2" />
                <p className="font-medium text-gray-900">Review Applications</p>
                <p className="text-sm text-gray-500">Process admission applications</p>
              </button>
              <button
                onClick={() => navigate("/admin/admissions")}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
              >
                <GraduationCap className="w-6 h-6 text-primary-600 mb-2" />
                <p className="font-medium text-gray-900">Manage Admissions</p>
                <p className="text-sm text-gray-500">Approve or reject admissions</p>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            {dashboardData?.recent_activity && dashboardData.recent_activity.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recent_activity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
