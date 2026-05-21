import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import Select from '../../components/shared/forms/Select';
import DatePicker from '../../components/shared/forms/DatePicker';
import { hostelService } from '../../api/services';
import type { HostelApiAllocation } from '../../types';
import { Plus, UserCheck, LogOut } from 'lucide-react';

export default function Allocations() {
  const [allocations, setAllocations] = useState<HostelApiAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadAllocations();
  }, []);

  const loadAllocations = async () => {
    try {
      const response = await hostelService.allocations.getAll();
      setAllocations(response.data.data || []);
    } catch (error) {
      console.error('Failed to load allocations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocate = () => {
    setFormData({ student_id: '', room_id: '', allocation_date: '', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hostelService.allocations.create(formData);
      setIsModalOpen(false);
      loadAllocations();
    } catch (error) {
      console.error('Failed to allocate room:', error);
    }
  };

  const handleVacate = async (allocation: HostelApiAllocation) => {
    try {
      await hostelService.allocations.vacate(allocation.id);
      loadAllocations();
    } catch (error) {
      console.error('Failed to vacate room:', error);
    }
  };

  const columns = [
    {
      key: 'student',
      header: 'Student',
      render: (row: HostelApiAllocation) => row.student?.name || 'N/A',
    },
    {
      key: 'room',
      header: 'Room',
      render: (row: HostelApiAllocation) => row.room?.room_number || 'N/A',
    },
    {
      key: 'hostel',
      header: 'Hostel',
      render: (row: HostelApiAllocation) => row.room?.hostel?.name || 'N/A',
    },
    {
      key: 'allocation_date',
      header: 'Allocation Date',
      render: (row: HostelApiAllocation) => row.allocation_date || 'N/A',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: HostelApiAllocation) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: HostelApiAllocation) => (
        <div className="flex gap-2">
          {row.status === 'Active' && (
            <Button
              variant="danger"
              size="sm"
              icon={<LogOut className="w-4 h-4" />}
              onClick={() => handleVacate(row)}
            >
              Vacate
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Room Allocations"
        subtitle="Manage student room allocations"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleAllocate}
          >
            Allocate Room
          </Button>
        }
      />

      <DataTable
        data={allocations}
        columns={columns}
        emptyMessage="No allocations found"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Allocate Room"
        submitText="Allocate"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <Select
              value={formData.student_id || ''}
              onChange={(e) => setFormData({ ...formData, student_id: parseInt(e.target.value) })}
              placeholder="Select Student"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
            <Select
              value={formData.room_id || ''}
              onChange={(e) => setFormData({ ...formData, room_id: parseInt(e.target.value) })}
              placeholder="Select Room"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allocation Date</label>
            <DatePicker
              value={formData.allocation_date || ''}
              onChange={(e) => setFormData({ ...formData, allocation_date: e.target.value })}
              required
            />
          </div>
        </div>
      </FormModal>
    </Layout>
  );
}
