import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import ConfirmModal from '../../components/shared/modals/ConfirmModal';
import Select from '../../components/shared/forms/Select';
import { transportService } from '../../api/services';
import type { TransportApiBus, CreateTransportApiBus } from '../../types';
import { Plus, Edit, Trash2, Bus } from 'lucide-react';

export default function Buses() {
  const [buses, setBuses] = useState<TransportApiBus[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<TransportApiBus | null>(null);
  const [formData, setFormData] = useState<Partial<CreateTransportApiBus>>({});

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      const response = await transportService.buses.getAll();
      setBuses(response.data.data || []);
    } catch (error) {
      console.error('Failed to load buses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedBus(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (bus: TransportApiBus) => {
    setSelectedBus(bus);
    setFormData(bus);
    setIsModalOpen(true);
  };

  const handleDelete = (bus: TransportApiBus) => {
    setSelectedBus(bus);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedBus) {
        await transportService.buses.update(selectedBus.id, formData);
      } else {
        await transportService.buses.create(formData as CreateTransportApiBus);
      }
      setIsModalOpen(false);
      loadBuses();
    } catch (error) {
      console.error('Failed to save bus:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedBus) {
      try {
        await transportService.buses.delete(selectedBus.id);
        setIsDeleteModalOpen(false);
        loadBuses();
      } catch (error) {
        console.error('Failed to delete bus:', error);
      }
    }
  };

  const columns = [
    {
      key: 'registration_number',
      header: 'Registration Number',
      render: (row: TransportApiBus) => row.registration_number,
    },
    {
      key: 'bus_number',
      header: 'Bus Number',
      render: (row: TransportApiBus) => row.bus_number,
    },
    {
      key: 'capacity',
      header: 'Capacity',
      render: (row: TransportApiBus) => row.capacity || 0,
    },
    {
      key: 'route',
      header: 'Route',
      render: (row: TransportApiBus) => row.route?.name || 'N/A',
    },
    {
      key: 'driver',
      header: 'Driver',
      render: (row: TransportApiBus) => row.driver?.name || 'N/A',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: TransportApiBus) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'Active' ? 'bg-green-100 text-green-800' :
          row.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: TransportApiBus) => (
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
        title="Bus Management"
        subtitle="Manage transport fleet and buses"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            Add Bus
          </Button>
        }
      />

      <DataTable
        data={buses}
        columns={columns}
        emptyMessage="No buses found"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={selectedBus ? 'Edit Bus' : 'Add Bus'}
        submitText={selectedBus ? 'Update' : 'Create'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
            <input
              type="text"
              className="input-field"
              value={formData.registration_number || ''}
              onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bus Number</label>
            <input
              type="text"
              className="input-field"
              value={formData.bus_number || ''}
              onChange={(e) => setFormData({ ...formData, bus_number: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input
              type="number"
              className="input-field"
              value={formData.capacity || ''}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Maintenance', label: 'Maintenance' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
              required
            />
          </div>
        </div>
      </FormModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Bus"
        message={`Are you sure you want to delete bus ${selectedBus?.bus_number}? This action cannot be undone.`}
        variant="danger"
      />
    </Layout>
  );
}
