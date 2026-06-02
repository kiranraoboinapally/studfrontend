import { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import ConfirmModal from '../../components/shared/modals/ConfirmModal';
import api from '../../api/axios';
import type { Department } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [departmentsRes, campusesRes] = await Promise.all([
        api.get('/api/v1/departments'),
        api.get('/api/v1/campuses')
      ]);
      setDepartments(departmentsRes.data.data || []);
      setCampuses(campusesRes.data.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedDepartment(null);
    setFormData({
      campus_id: '',
      name: '',
      code: '',
      established_year: new Date().getFullYear(),
      description: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      campus_id: department.campus_id?.toString() || '',
      name: department.name || '',
      code: department.code || '',
      established_year: department.established_year || new Date().getFullYear(),
      description: department.description || '',
      is_active: department.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        campus_id: parseInt(formData.campus_id),
        established_year: parseInt(formData.established_year),
      };

      if (selectedDepartment) {
        await api.put(`/api/v1/departments/${selectedDepartment.id}`, payload);
        toast.success('Department updated!');
      } else {
        await api.post('/api/v1/departments', payload);
        toast.success('Department created!');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save department');
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedDepartment) {
      try {
        await api.delete(`/api/v1/departments/${selectedDepartment.id}`);
        toast.success('Department deleted!');
        setIsDeleteModalOpen(false);
        loadData();
      } catch (error) {
        toast.error('Failed to delete department');
      }
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row: Department) => row.name,
    },
    {
      key: 'code',
      header: 'Code',
      render: (row: Department) => row.code,
    },
    {
      key: 'campus',
      header: 'Campus',
      render: (row: Department) => row.campus?.name || 'N/A',
    },
    {
      key: 'established_year',
      header: 'Established',
      render: (row: Department) => row.established_year,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row: Department) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Department) => (
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
        title="Departments"
        subtitle="Manage departments across campuses"
        actions={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            Add Department
          </Button>
        }
      />

      <DataTable
        data={departments as any}
        columns={columns as any}
        emptyMessage="No departments found"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={selectedDepartment ? 'Edit Department' : 'Add Department'}
        submitText={selectedDepartment ? 'Update' : 'Create'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
            <select
              className="input-field"
              value={formData.campus_id || ''}
              onChange={(e) => setFormData({ ...formData, campus_id: e.target.value })}
              required
            >
              <option value="">Select Campus</option>
              {campuses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
            <input
              type="number"
              className="input-field"
              value={formData.established_year || ''}
              onChange={(e) => setFormData({ ...formData, established_year: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
        title="Delete Department"
        message={`Are you sure you want to delete ${selectedDepartment?.name}? This action cannot be undone.`}
        variant="danger"
      />
    </Layout>
  );
}
