import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import ConfirmModal from '../../components/shared/modals/ConfirmModal';
import DatePicker from '../../components/shared/forms/DatePicker';
// import Select from '../../components/shared/forms/Select';
import { admissionService } from '../../api/services';
import type { AdmissionApiCycle, CreateAdmissionApiCycle, StatusCode } from '../../types';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdmissionCycles() {
  const [cycles, setCycles] = useState<AdmissionApiCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<AdmissionApiCycle | null>(null);
  const [formData, setFormData] = useState<Partial<CreateAdmissionApiCycle>>({});

  useEffect(() => {
    loadCycles();
  }, []);

  const loadCycles = async () => {
    try {
      const response = await admissionService.cycles.getAll();
      setCycles(response.data.data || []);
    } catch (error) {
      console.error('Failed to load cycles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCycle(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (cycle: AdmissionApiCycle) => {
    setSelectedCycle(cycle);
    setFormData(cycle);
    setIsModalOpen(true);
  };

  const handleDelete = (cycle: AdmissionApiCycle) => {
    setSelectedCycle(cycle);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCycle) {
        await admissionService.cycles.update(selectedCycle.id, formData);
      } else {
        await admissionService.cycles.create(formData as CreateAdmissionApiCycle);
      }
      setIsModalOpen(false);
      loadCycles();
    } catch (error) {
      console.error('Failed to save cycle:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedCycle) {
      try {
        await admissionService.cycles.delete(selectedCycle.id);
        setIsDeleteModalOpen(false);
        loadCycles();
      } catch (error) {
        console.error('Failed to delete cycle:', error);
      }
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row: AdmissionApiCycle) => row.name,
    },
    {
      key: 'academic_year',
      header: 'Academic Year',
      render: (row: AdmissionApiCycle) => row.academic_year,
    },
    {
      key: 'dates',
      header: 'Duration',
      render: (row: AdmissionApiCycle) => `${row.start_date} to ${row.end_date}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: AdmissionApiCycle) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: AdmissionApiCycle) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => {/* TODO: View details */}}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleEdit(row)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => handleDelete(row)}
          >
            Delete
          </Button>
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
        title="Admission Cycles"
        subtitle="Manage admission cycles and schedules"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            Add Cycle
          </Button>
        }
      />

      <DataTable
        data={cycles}
        columns={columns}
        emptyMessage="No admission cycles found"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={selectedCycle ? 'Edit Admission Cycle' : 'Add Admission Cycle'}
        submitText={selectedCycle ? 'Update' : 'Create'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="input-field"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
            <input
              type="text"
              className="input-field"
              value={formData.academic_year || ''}
              onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
              placeholder="e.g., 2024-2025"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <DatePicker
              value={formData.start_date || ''}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <DatePicker
              value={formData.end_date || ''}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={formData.is_active ?? true}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>
        </div>
      </FormModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Admission Cycle"
        message={`Are you sure you want to delete ${selectedCycle?.name}? This action cannot be undone.`}
        variant="danger"
      />
    </Layout>
  );
}
