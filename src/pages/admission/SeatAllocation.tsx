import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import Select from '../../components/shared/forms/Select';
import { admissionService } from '../../api/services';
import type { AdmissionApiSeatAllocation, CreateAdmissionApiSeatAllocation } from '../../types';
import { Plus, UserCheck } from 'lucide-react';

export default function SeatAllocation() {
  const [allocations, setAllocations] = useState<AdmissionApiSeatAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateAdmissionApiSeatAllocation>>({});

  useEffect(() => {
    loadAllocations();
  }, []);

  const loadAllocations = async () => {
    try {
      const response = await admissionService.seatAllocations.getAll();
      setAllocations(response.data.data || []);
    } catch (error) {
      console.error('Failed to load allocations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await admissionService.seatAllocations.create(formData as CreateAdmissionApiSeatAllocation);
      setIsModalOpen(false);
      loadAllocations();
    } catch (error) {
      console.error('Failed to allocate seat:', error);
    }
  };

  const columns = [
    {
      key: 'applicant_name',
      header: 'Applicant',
      render: (row: AdmissionApiSeatAllocation) => row.applicant?.name || 'N/A',
    },
    {
      key: 'program',
      header: 'Program',
      render: (row: AdmissionApiSeatAllocation) => row.program?.name || 'N/A',
    },
    {
      key: 'college',
      header: 'College',
      render: (row: AdmissionApiSeatAllocation) => row.college?.name || 'N/A',
    },
    {
      key: 'allocation_date',
      header: 'Allocation Date',
      render: (row: AdmissionApiSeatAllocation) => row.allocation_date || 'N/A',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: AdmissionApiSeatAllocation) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {row.is_confirmed ? 'Confirmed' : 'Pending'}
        </span>
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
        title="Seat Allocation"
        subtitle="Manage seat allocations for admitted students"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            Allocate Seat
          </Button>
        }
      />

      <DataTable
        data={allocations}
        columns={columns}
        emptyMessage="No seat allocations found"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Allocate Seat"
        submitText="Allocate"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Applicant</label>
            <Select
              value={formData.applicant_id?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, applicant_id: parseInt(e.target.value) })}
              placeholder="Select Applicant"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
            <Select
              value={formData.program_id?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, program_id: parseInt(e.target.value) })}
              placeholder="Select Program"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
            <Select
              value={formData.college_id?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, college_id: parseInt(e.target.value) })}
              placeholder="Select College"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_confirmed"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={formData.is_confirmed ?? false}
              onChange={(e) => setFormData({ ...formData, is_confirmed: e.target.checked })}
            />
            <label htmlFor="is_confirmed" className="ml-2 block text-sm text-gray-900">
              Confirm Allocation
            </label>
          </div>
        </div>
      </FormModal>
    </Layout>
  );
}
