import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import ConfirmModal from '../../components/shared/modals/ConfirmModal';
import Select from '../../components/shared/forms/Select';
import { hostelService } from '../../api/services';
import type { HostelApiRoom, CreateHostelApiRoom } from '../../types';
import { Plus, Edit, Trash2, Bed } from 'lucide-react';

export default function Rooms() {
  const [rooms, setRooms] = useState<HostelApiRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<HostelApiRoom | null>(null);
  const [formData, setFormData] = useState<Partial<CreateHostelApiRoom>>({});

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await hostelService.rooms.getAll();
      setRooms(response.data.data || []);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedRoom(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (room: HostelApiRoom) => {
    setSelectedRoom(room);
    setFormData(room);
    setIsModalOpen(true);
  };

  const handleDelete = (room: HostelApiRoom) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedRoom) {
        await hostelService.rooms.update(selectedRoom.id, formData);
      } else {
        await hostelService.rooms.create(formData as CreateHostelApiRoom);
      }
      setIsModalOpen(false);
      loadRooms();
    } catch (error) {
      console.error('Failed to save room:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedRoom) {
      try {
        await hostelService.rooms.delete(selectedRoom.id);
        setIsDeleteModalOpen(false);
        loadRooms();
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
    }
  };

  const columns = [
    {
      key: 'room_number',
      header: 'Room Number',
      render: (row: HostelApiRoom) => row.room_number,
    },
    {
      key: 'hostel',
      header: 'Hostel',
      render: (row: HostelApiRoom) => row.hostel?.name || 'N/A',
    },
    {
      key: 'room_type',
      header: 'Room Type',
      render: (row: HostelApiRoom) => row.room_type || 'N/A',
    },
    {
      key: 'capacity',
      header: 'Capacity',
      render: (row: HostelApiRoom) => row.capacity || 0,
    },
    {
      key: 'occupied',
      header: 'Occupied',
      render: (row: HostelApiRoom) => `${row.occupied_beds || 0}/${row.capacity || 0}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: HostelApiRoom) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'Available' ? 'bg-green-100 text-green-800' :
          row.status === 'Occupied' ? 'bg-blue-100 text-blue-800' :
          row.status === 'Maintenance' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: HostelApiRoom) => (
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
        title="Room Management"
        subtitle="Manage hostel rooms and occupancy"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            Add Room
          </Button>
        }
      />

      <DataTable
        data={rooms}
        columns={columns}
        emptyMessage="No rooms found"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={selectedRoom ? 'Edit Room' : 'Add Room'}
        submitText={selectedRoom ? 'Update' : 'Create'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
            <input
              type="text"
              className="input-field"
              value={formData.room_number || ''}
              onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
            <Select
              value={formData.room_type || ''}
              onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
              options={[
                { value: 'Single', label: 'Single' },
                { value: 'Double', label: 'Double' },
                { value: 'Triple', label: 'Triple' },
                { value: 'Dormitory', label: 'Dormitory' },
              ]}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
            <input
              type="number"
              className="input-field"
              value={formData.floor || ''}
              onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Available', label: 'Available' },
                { value: 'Occupied', label: 'Occupied' },
                { value: 'Maintenance', label: 'Maintenance' },
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
        title="Delete Room"
        message={`Are you sure you want to delete room ${selectedRoom?.room_number}? This action cannot be undone.`}
        variant="danger"
      />
    </Layout>
  );
}
