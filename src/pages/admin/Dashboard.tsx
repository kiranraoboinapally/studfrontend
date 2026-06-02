import { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout";
import PageHeader from "../../components/shared/PageHeader";
import StatCard from "../../components/shared/StatCard";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import api from "../../api/axios";
import {
  Users, Building2, BookOpen, ClipboardList,
  GraduationCap, IndianRupee,
} from "lucide-react";

interface Stats {
  total_students: number;
  total_universities: number;
  total_programs: number;
  pending_applications: number;
  total_employees: number;
  total_revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats]     = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch data from multiple backend endpoints
        const [studentsRes, universitiesRes, programsRes, applicantsRes, employeesRes, financeRes] = await Promise.all([
          api.get("/api/v1/students"),
          api.get("/api/v1/universities"),
          api.get("/api/v1/academic/programs"),
          api.get("/api/v1/admissions/applicants"),
          api.get("/api/v1/hr/employees"),
          api.get("/api/v1/finance/summary"),
        ]);

        setStats({
          total_students: studentsRes.data.data?.length || 0,
          total_universities: universitiesRes.data.data?.length || 0,
          total_programs: programsRes.data.data?.length || 0,
          pending_applications: applicantsRes.data.data?.filter((a: any) => a.status_id === 1).length || 0,
          total_employees: employeesRes.data.data?.length || 0,
          total_revenue: financeRes.data.data?.total_revenue || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  return (
    <Layout>
      <PageHeader
        title="University Dashboard"
        subtitle="Complete overview of the university system"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard
          title="Total Students"
          value={stats?.total_students || 0}
          icon={GraduationCap}
          color="blue"
        />
        <StatCard
          title="Universities"
          value={stats?.total_universities || 0}
          icon={Building2}
          color="green"
        />
        <StatCard
          title="Programs"
          value={stats?.total_programs || 0}
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Pending Applications"
          value={stats?.pending_applications || 0}
          icon={ClipboardList}
          color="yellow"
        />
        <StatCard
          title="Total Employees"
          value={stats?.total_employees || 0}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${((stats?.total_revenue || 0) / 100000).toFixed(1)}L`}
          icon={IndianRupee}
          color="green"
          subtitle="Across all universities"
        />
      </div>
    </Layout>
  );
}