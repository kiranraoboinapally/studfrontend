import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import ConfirmModal from '../../components/shared/modals/ConfirmModal';
import { universityService } from '../../api/services';
import type { University, CreateUniversity } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Universities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [formData, setFormData] = useState<Partial<CreateUniversity>>({});

  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities = async () => {
    try {
      const response = await universityService.getAll();
      setUniversities(response.data.data || []);
    } catch (error) {
      console.error('Failed to load universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedUniversity(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (university: University) => {
    setSelectedUniversity(university);
    setFormData(university);
    setIsModalOpen(true);
  };

  const handleDelete = (university: University) => {
    setSelectedUniversity(university);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUniversity) {
        await universityService.update(selectedUniversity.id, formData);
      } else {
        await universityService.create(formData as CreateUniversity);
      }
      setIsModalOpen(false);
      loadUniversities();
    } catch (error) {
      console.error('Failed to save university:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedUniversity) {
      try {
        await universityService.delete(selectedUniversity.id);
        setIsDeleteModalOpen(false);
        loadUniversities();
      } catch (error) {
        console.error('Failed to delete university:', error);
      }
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row: University) => row.name,
    },
    {
      key: 'code',
      header: 'Code',
      render: (row: University) => row.code,
    },
    {
      key: 'address',
      header: 'Address',
      render: (row: University) => row.address,
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (row: University) => row.phone,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row: University) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: University) => (
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
        title="Universities"
        subtitle="Manage universities in the system"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            Add University
          </Button>
        }
      />

      <DataTable
        data={universities}
        columns={columns}
        emptyMessage="No universities found"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={selectedUniversity ? 'Edit University' : 'Add University'}
        submitText={selectedUniversity ? 'Update' : 'Create'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              className="input-field"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="input-field"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
        title="Delete University"
        message={`Are you sure you want to delete ${selectedUniversity?.name}? This action cannot be undone.`}
        variant="danger"
      />
    </Layout>
  );
}
