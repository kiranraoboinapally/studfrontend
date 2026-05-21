import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import ConfirmModal from '../../components/shared/modals/ConfirmModal';
import Select from '../../components/shared/forms/Select';
import { hrService } from '../../api/services';
import type { HrApiEmployee, CreateHrApiEmployee } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState<HrApiEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<HrApiEmployee | null>(null);
  const [formData, setFormData] = useState<Partial<CreateHrApiEmployee>>({});

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await hrService.employees.getAll();
      setEmployees(response.data.data || []);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedEmployee(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (employee: HrApiEmployee) => {
    setSelectedEmployee(employee);
    setFormData(employee);
    setIsModalOpen(true);
  };

  const handleDelete = (employee: HrApiEmployee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedEmployee) {
        await hrService.employees.update(selectedEmployee.id, formData);
      } else {
        await hrService.employees.create(formData as CreateHrApiEmployee);
      }
      setIsModalOpen(false);
      loadEmployees();
    } catch (error) {
      console.error('Failed to save employee:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedEmployee) {
      try {
        await hrService.employees.delete(selectedEmployee.id);
        setIsDeleteModalOpen(false);
        loadEmployees();
      } catch (error) {
        console.error('Failed to delete employee:', error);
      }
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row: HrApiEmployee) => `${row.first_name} ${row.last_name}`,
    },
    {
      key: 'email',
      header: 'Email',
      render: (row: HrApiEmployee) => row.email,
    },
    {
      key: 'designation',
      header: 'Designation',
      render: (row: HrApiEmployee) => row.designation?.name || 'N/A',
    },
    {
      key: 'department',
      header: 'Department',
      render: (row: HrApiEmployee) => row.department || 'N/A',
    },
    {
      key: 'employment_type',
      header: 'Employment Type',
      render: (row: HrApiEmployee) => row.employment_type?.name || 'N/A',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row: HrApiEmployee) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: HrApiEmployee) => (
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
        title="Employees"
        subtitle="Manage employee records and information"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            Add Employee
          </Button>
        }
      />

      <DataTable
        data={employees}
        columns={columns}
        emptyMessage="No employees found"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={selectedEmployee ? 'Edit Employee' : 'Add Employee'}
        submitText={selectedEmployee ? 'Update' : 'Create'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                className="input-field"
                value={formData.first_name || ''}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                className="input-field"
                value={formData.last_name || ''}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="input-field"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              className="input-field"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee?.first_name} ${selectedEmployee?.last_name}? This action cannot be undone.`}
        variant="danger"
      />
    </Layout>
  );
}
