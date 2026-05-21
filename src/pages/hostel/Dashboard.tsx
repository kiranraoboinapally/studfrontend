import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import StatCard from '../../components/shared/StatCard';
import { BarChart, PieChart } from '../../components/shared/charts';
import { hostelService } from '../../api/services';
import type { HostelApiRoom, HostelApiAllocation } from '../../types';
import { Building2, Users, Bed, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

export default function HostelDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await hostelService.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load hostel stats:', error);
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

  const occupancyData = [
    { name: 'Occupied', value: stats?.occupied_rooms || 0 },
    { name: 'Vacant', value: stats?.vacant_rooms || 0 },
    { name: 'Maintenance', value: stats?.maintenance_rooms || 0 },
  ];

  const roomTypeData = [
    { name: 'Single', value: stats?.single_rooms || 0 },
    { name: 'Double', value: stats?.double_rooms || 0 },
    { name: 'Triple', value: stats?.triple_rooms || 0 },
    { name: 'Dorm', value: stats?.dorm_rooms || 0 },
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <Layout>
      <PageHeader
        title="Hostel Dashboard"
        subtitle="Overview of hostel management and occupancy"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Rooms"
          value={stats?.total_rooms || 0}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Occupied Rooms"
          value={stats?.occupied_rooms || 0}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Vacant Rooms"
          value={stats?.vacant_rooms || 0}
          icon={Bed}
          color="purple"
        />
        <StatCard
          title="Total Students"
          value={stats?.total_students || 0}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Pending Mess Bills"
          value={stats?.pending_bills || 0}
          icon={DollarSign}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Occupancy</h3>
          <PieChart
            data={occupancyData}
            colors={colors}
            height={300}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Types Distribution</h3>
          <BarChart
            data={roomTypeData}
            bars={[
              { dataKey: 'value', name: 'Count', color: '#3B82F6' },
            ]}
            xAxisDataKey="name"
            height={300}
          />
        </div>
      </div>
    </Layout>
  );
}
