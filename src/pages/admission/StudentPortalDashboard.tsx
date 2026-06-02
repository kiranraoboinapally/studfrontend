import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutDashboard, FileText, ClipboardList, FolderOpen, Award,
  CreditCard, Bell, HelpCircle, User, LogOut, ChevronRight,
  Plus, Clock, CheckCircle, AlertCircle, TrendingUp
} from "lucide-react";
import StatCard from "../../components/shared/StatCard";
import { StudentDashboard as StudentDashboardType } from "../../types/admissionPortal";
import { getStudentDashboard } from "../../api/services/admissionPortalService";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
  { label: "Apply Now", icon: Plus, path: "/student/apply" },
  { label: "My Applications", icon: FileText, path: "/student/applications" },
  { label: "Application Tracking", icon: ClipboardList, path: "/student/tracking" },
  { label: "Documents", icon: FolderOpen, path: "/student/documents" },
  { label: "Scholarships", icon: Award, path: "/student/scholarships" },
  { label: "Payment History", icon: CreditCard, path: "/student/payments" },
  { label: "Notifications", icon: Bell, path: "/student/notifications", badge: 3 },
  { label: "Support Tickets", icon: HelpCircle, path: "/student/support" },
  { label: "Profile", icon: User, path: "/student/profile" },
  { label: "Logout", icon: LogOut, path: "/logout" },
];

export default function StudentPortalDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<StudentDashboardType | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await getStudentDashboard();
      if (response.success) {
        setDashboardData(response.data || null);
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      // Set mock data for demo
      setDashboardData(getMockDashboardData());
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    if (path === "/logout") {
      handleLogout();
    } else {
      navigate(path);
    }
    setSidebarOpen(false);
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

  const data = dashboardData;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No dashboard data available</p>
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
          <h1 className="text-lg font-bold">Student Portal</h1>
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
                <p className="text-primary-200 text-xs">Student Portal</p>
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
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary-100 hover:bg-primary-700 hover:text-white transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </button>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-primary-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                JS
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-white text-sm font-medium truncate">John Smith</p>
                <p className="text-primary-200 text-xs truncate">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Desktop Header */}
        <div className="hidden lg:block bg-gradient-to-r from-primary-900 to-primary-800 text-white py-6 px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, John!</h1>
              <p className="text-primary-200">Track your admission progress</p>
            </div>
            <button
              onClick={() => navigate("/student/notifications")}
              className="relative p-2 hover:bg-primary-700 rounded-lg"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8">
          {/* Quick Actions */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/student/apply")}
              className="w-full lg:w-auto btn-primary flex items-center justify-center gap-2 px-6 py-3 text-lg"
            >
              <Plus className="w-5 h-5" />
              Start New Application
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Application Status"
              value={data.application_status.status}
              icon={FileText}
              color="blue"
              subtitle={`ID: ${data.application_status.application_id}`}
            />
            <StatCard
              title="Admission Progress"
              value={`${data.admission_progress.percentage}%`}
              icon={TrendingUp}
              color="green"
              subtitle={`${data.admission_progress.completed_stages.length}/${data.admission_progress.total_stages} stages`}
            />
            <StatCard
              title="Scholarship Status"
              value={data.scholarship_status.status}
              icon={Award}
              color="purple"
              subtitle={data.scholarship_status.amount ? `$${data.scholarship_status.amount}` : "N/A"}
            />
            <StatCard
              title="Pending Tasks"
              value={data.pending_tasks.length}
              icon={Clock}
              color="yellow"
              subtitle="Requires attention"
            />
          </div>

          {/* Recent Notifications */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
              <button
                onClick={() => navigate("/student/notifications")}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {data.recent_notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    notification.read ? "bg-gray-50" : "bg-blue-50"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      notification.type === "success"
                        ? "bg-green-100 text-green-600"
                        : notification.type === "warning"
                        ? "bg-yellow-100 text-yellow-600"
                        : notification.type === "error"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {notification.type === "success" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : notification.type === "warning" ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-xs text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          {data.pending_tasks.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Pending Tasks</h2>
                <span className="text-sm text-gray-500">{data.pending_tasks.length} tasks</span>
              </div>
              <div className="space-y-3">
                {data.pending_tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.task}</p>
                        <p className="text-xs text-gray-500">Due: {task.due_date}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mock data for demo purposes
function getMockDashboardData(): StudentDashboardType {
  return {
    application_status: {
      status: "In Progress",
      application_id: "APP2024001",
      program_applied: "B.Tech Computer Science",
      submitted_date: "2024-01-15",
    },
    admission_progress: {
      current_stage: "Document Verification",
      completed_stages: [
        "Enquiry Submitted",
        "Lead Assigned",
        "Counsellor Contacted",
        "Registered",
        "Application Submitted",
        "Payment Completed",
      ],
      total_stages: 12,
      percentage: 50,
    },
    scholarship_status: {
      type: "Merit Scholarship",
      status: "Under Review",
      amount: 50000,
      percentage: 25,
    },
    pending_tasks: [
      { id: 1, task: "Upload disability certificate", due_date: "2024-01-20", priority: "high" },
      { id: 2, task: "Complete scholarship form", due_date: "2024-01-22", priority: "medium" },
      { id: 3, task: "Verify contact details", due_date: "2024-01-25", priority: "low" },
    ],
    recent_notifications: [
      {
        id: 1,
        title: "Document Verification Started",
        message: "Your documents are now under review by the admission team.",
        date: "2024-01-18",
        read: false,
        type: "info",
      },
      {
        id: 2,
        title: "Payment Successful",
        message: "Your application fee payment has been successfully processed.",
        date: "2024-01-17",
        read: true,
        type: "success",
      },
      {
        id: 3,
        title: "Scholarship Application Received",
        message: "Your scholarship application has been submitted for review.",
        date: "2024-01-16",
        read: true,
        type: "info",
      },
    ],
  };
}
