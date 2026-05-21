import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import StatCard from '../../components/shared/StatCard';
import { BarChart, PieChart } from '../../components/shared/charts';
import { transportService } from '../../api/services';
import type { TransportApiBus, TransportApiPass } from '../../types';
import { Bus, MapPin, Users, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

export default function TransportDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await transportService.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load transport stats:', error);
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

  const busStatusData = [
    { name: 'Active', value: stats?.active_buses || 0 },
    { name: 'Maintenance', value: stats?.maintenance_buses || 0 },
    { name: 'Inactive', value: stats?.inactive_buses || 0 },
  ];

  const routeData = [
    { name: 'Route 1', students: stats?.route1_students || 0 },
    { name: 'Route 2', students: stats?.route2_students || 0 },
    { name: 'Route 3', students: stats?.route3_students || 0 },
    { name: 'Route 4', students: stats?.route4_students || 0 },
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <Layout>
      <PageHeader
        title="Transport Dashboard"
        subtitle="Overview of transport management and fleet"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Buses"
          value={stats?.total_buses || 0}
          icon={Bus}
          color="blue"
        />
        <StatCard
          title="Active Routes"
          value={stats?.active_routes || 0}
          icon={MapPin}
          color="green"
        />
        <StatCard
          title="Total Passes"
          value={stats?.total_passes || 0}
          icon={CreditCard}
          color="purple"
        />
        <StatCard
          title="Students Using Transport"
          value={stats?.students_using_transport || 0}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Pending Renewals"
          value={stats?.pending_renewals || 0}
          icon={AlertCircle}
          color="yellow"
        />
        <StatCard
          title="Maintenance Requests"
          value={stats?.maintenance_requests || 0}
          icon={AlertCircle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bus Status</h3>
          <PieChart
            data={busStatusData}
            colors={colors}
            height={300}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Students per Route</h3>
          <BarChart
            data={routeData}
            bars={[
              { dataKey: 'students', name: 'Students', color: '#3B82F6' },
            ]}
            xAxisDataKey="name"
            height={300}
          />
        </div>
      </div>
    </Layout>
  );
}
