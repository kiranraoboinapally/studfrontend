import { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import ConfirmModal from '../../components/shared/modals/ConfirmModal';
import api from '../../api/axios';
import type { Campus } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Campuses() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [campusesRes, universitiesRes] = await Promise.all([
        api.get('/api/v1/campuses'),
        api.get('/api/v1/universities')
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
    setFormData({
      university_id: '',
      name: '',
      code: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      phone: '',
      is_main_campus: false,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (campus: Campus) => {
    setSelectedCampus(campus);
    setFormData({
      university_id: campus.university_id?.toString() || '',
      name: campus.name || '',
      code: campus.code || '',
      address: campus.address || '',
      city: campus.city || '',
      state: campus.state || '',
      postal_code: campus.postal_code || '',
      phone: campus.phone || '',
      is_main_campus: campus.is_main_campus || false,
      is_active: campus.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (campus: Campus) => {
    setSelectedCampus(campus);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        university_id: parseInt(formData.university_id),
      };

      if (selectedCampus) {
        await api.put(`/api/v1/campuses/${selectedCampus.id}`, payload);
        toast.success('Campus updated!');
      } else {
        await api.post('/api/v1/campuses', payload);
        toast.success('Campus created!');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save campus');
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedCampus) {
      try {
        await api.delete(`/api/v1/campuses/${selectedCampus.id}`);
        toast.success('Campus deleted!');
        setIsDeleteModalOpen(false);
        loadData();
      } catch (error) {
        toast.error('Failed to delete campus');
      }
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
      key: 'is_main_campus',
      header: 'Main Campus',
      render: (row: Campus) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_main_campus ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.is_main_campus ? 'Yes' : 'No'}
        </span>
      ),
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
        actions={
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
        data={campuses as any}
        columns={columns as any}
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
            <select
              className="input-field"
              value={formData.university_id || ''}
              onChange={(e) => setFormData({ ...formData, university_id: e.target.value })}
              required
            >
              <option value="">Select University</option>
              {universities.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                className="input-field"
                value={formData.state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                className="input-field"
                value={formData.postal_code || ''}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
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
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_main_campus}
                onChange={(e) => setFormData({ ...formData, is_main_campus: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="text-sm">Main Campus</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="text-sm">Active</span>
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
