import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import StatCard from '../../components/shared/StatCard';
import { LineChart, BarChart } from '../../components/shared/charts';
import { admissionService } from '../../api/services';
import type { AdmissionApiCycle, CycleStats } from '../../types';
import { Users, FileText, CheckCircle, Clock, TrendingUp, Calendar } from 'lucide-react';

export default function AdmissionDashboard() {
  const [cycles, setCycles] = useState<AdmissionApiCycle[]>([]);
  const [stats, setStats] = useState<CycleStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await admissionService.cycles.getOpenCycles();
      setCycles(response.data.data || []);
      
      if (response.data.data && response.data.data.length > 0) {
        const statsResponse = await admissionService.cycles.getStats(response.data.data[0].id);
        setStats(statsResponse.data.data || null);
      }
    } catch (error) {
      console.error('Failed to load admission data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const chartData = [
    { name: 'Applied', value: stats?.total_applications || 0 },
    { name: 'Approved', value: stats?.approved_applications || 0 },
    { name: 'Rejected', value: stats?.rejected_applications || 0 },
    { name: 'Pending', value: stats?.pending_applications || 0 },
  ];

  const trendData = [
    { month: 'Jan', applications: 120, approvals: 80 },
    { month: 'Feb', applications: 150, approvals: 100 },
    { month: 'Mar', applications: 180, approvals: 120 },
    { month: 'Apr', applications: 200, approvals: 140 },
    { month: 'May', applications: 250, approvals: 160 },
    { month: 'Jun', applications: 300, approvals: 180 },
  ];

  return (
    <Layout>
      <PageHeader
        title="Admissions Dashboard"
        subtitle="Overview of admission cycles and applications"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Applications"
          value={stats?.total_applications || 0}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Approved"
          value={stats?.approved_applications || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Pending Review"
          value={stats?.pending_applications || 0}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Rejected"
          value={stats?.rejected_applications || 0}
          icon={Users}
          color="red"
        />
        <StatCard
          title="Seats Allocated"
          value={stats?.seats_allocated || 0}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Active Cycles"
          value={cycles.length}
          icon={Calendar}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
          <BarChart
            data={chartData}
            bars={[
              { dataKey: 'value', name: 'Count', color: '#3B82F6' },
            ]}
            xAxisDataKey="name"
            height={300}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trends</h3>
          <LineChart
            data={trendData}
            lines={[
              { dataKey: 'applications', name: 'Applications', color: '#3B82F6' },
              { dataKey: 'approvals', name: 'Approvals', color: '#10B981' },
            ]}
            xAxisDataKey="month"
            height={300}
          />
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Admission Cycles</h3>
        {cycles.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No active admission cycles</p>
        ) : (
          <div className="space-y-4">
            {cycles.map((cycle) => (
              <div
                key={cycle.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{cycle.name}</h4>
                  <p className="text-sm text-gray-500">
                    {cycle.academic_year} • {cycle.start_date} to {cycle.end_date}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
