import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import ConfirmModal from '../../components/shared/modals/ConfirmModal';
import Select from '../../components/shared/forms/Select';
import { universityService } from '../../api/services';
import type { Campus, CreateCampus, University } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Campuses() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [formData, setFormData] = useState<Partial<CreateCampus>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [campusesRes, universitiesRes] = await Promise.all([
        // Note: campuses service would need to be added to coreService
        // For now, using a placeholder
        Promise.resolve({ data: { data: [] } }),
        universityService.getAll()
      ]);
      setCampuses(campusesRes.data.data || []);
      setUniversities(universitiesRes.data.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCampus(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (campus: Campus) => {
    setSelectedCampus(campus);
    setFormData(campus);
    setIsModalOpen(true);
  };

  const handleDelete = (campus: Campus) => {
    setSelectedCampus(campus);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement campus service calls
    setIsModalOpen(false);
    loadData();
  };

  const handleConfirmDelete = async () => {
    if (selectedCampus) {
      // TODO: Implement campus delete
      setIsDeleteModalOpen(false);
      loadData();
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row: Campus) => row.name,
    },
    {
      key: 'code',
      header: 'Code',
      render: (row: Campus) => row.code,
    },
    {
      key: 'university',
      header: 'University',
      render: (row: Campus) => row.university?.name || 'N/A',
    },
    {
      key: 'city',
      header: 'City',
      render: (row: Campus) => row.city || 'N/A',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row: Campus) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Campus) => (
        <div className="flex gap-2">
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
        title="Campuses"
        subtitle="Manage campuses across universities"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            Add Campus
          </Button>
        }
      />

      <DataTable
        data={campuses}
        columns={columns}
        emptyMessage="No campuses found"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={selectedCampus ? 'Edit Campus' : 'Add Campus'}
        submitText={selectedCampus ? 'Update' : 'Create'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
            <Select
              value={formData.university_id?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, university_id: parseInt(e.target.value) })}
              options={universities.map(u => ({ value: u.id.toString(), label: u.name }))}
              placeholder="Select University"
              required
            />
          </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input
              type="text"
              className="input-field"
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              className="input-field"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
        title="Delete Campus"
        message={`Are you sure you want to delete ${selectedCampus?.name}? This action cannot be undone.`}
        variant="danger"
      />
    </Layout>
  );
}
