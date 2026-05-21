import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import ConfirmModal from '../../components/shared/modals/ConfirmModal';
import Select from '../../components/shared/forms/Select';
import { collegeService, departmentService } from '../../api/services';
import type { Department, CreateDepartment, College } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Partial<CreateDepartment>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [departmentsRes, collegesRes] = await Promise.all([
        departmentService.getAll(),
        collegeService.getAll()
      ]);
      setDepartments(departmentsRes.data.data || []);
      setColleges(collegesRes.data.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedDepartment(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setFormData(department);
    setIsModalOpen(true);
  };

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedDepartment) {
        await departmentService.update(selectedDepartment.id, formData);
      } else {
        await departmentService.create(formData as CreateDepartment);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to save department:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedDepartment) {
      try {
        await departmentService.delete(selectedDepartment.id);
        setIsDeleteModalOpen(false);
        loadData();
      } catch (error) {
        console.error('Failed to delete department:', error);
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
      key: 'college',
      header: 'College',
      render: (row: Department) => row.college?.name || 'N/A',
    },
    {
      key: 'hod',
      header: 'HOD',
      render: (row: Department) => row.hod?.name || 'Not Assigned',
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
        subtitle="Manage departments across colleges"
        action={
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
        data={departments}
        columns={columns}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
            <Select
              value={formData.college_id?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, college_id: parseInt(e.target.value) })}
              options={colleges.map(c => ({ value: c.id.toString(), label: c.name }))}
              placeholder="Select College"
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
