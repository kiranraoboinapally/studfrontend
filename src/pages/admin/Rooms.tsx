import { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import ConfirmModal from '../../components/shared/modals/ConfirmModal';
import api from '../../api/axios';
import type { Room } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [roomsRes, campusesRes] = await Promise.all([
        api.get('/api/v1/rooms'),
        api.get('/api/v1/campuses')
      ]);
      setRooms(roomsRes.data.data || []);
      setCampuses(campusesRes.data.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedRoom(null);
    setFormData({
      campus_id: '',
      room_number: '',
      room_type: 'lecture_hall',
      capacity: 60,
      building: '',
      floor: 1,
      has_projector: false,
      has_whiteboard: true,
      has_computers: false,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      campus_id: room.campus_id?.toString() || '',
      room_number: room.room_number || '',
      room_type: room.room_type || 'lecture_hall',
      capacity: room.capacity || 60,
      building: room.building || '',
      floor: room.floor || 1,
      has_projector: room.has_projector || false,
      has_whiteboard: room.has_whiteboard || true,
      has_computers: room.has_computers || false,
      is_active: room.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        campus_id: parseInt(formData.campus_id),
        capacity: parseInt(formData.capacity),
        floor: parseInt(formData.floor),
      };

      if (selectedRoom) {
        await api.put(`/api/v1/rooms/${selectedRoom.id}`, payload);
        toast.success('Room updated!');
      } else {
        await api.post('/api/v1/rooms', payload);
        toast.success('Room created!');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save room');
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedRoom) {
      try {
        await api.delete(`/api/v1/rooms/${selectedRoom.id}`);
        toast.success('Room deleted!');
        setIsDeleteModalOpen(false);
        loadData();
      } catch (error) {
        toast.error('Failed to delete room');
      }
    }
  };

  const columns = [
    {
      key: 'room_number',
      header: 'Room Number',
      render: (row: Room) => row.room_number,
    },
    {
      key: 'room_type',
      header: 'Type',
      render: (row: Room) => row.room_type?.replace('_', ' ').toUpperCase() || 'N/A',
    },
    {
      key: 'campus',
      header: 'Campus',
      render: (row: Room) => row.campus?.name || 'N/A',
    },
    {
      key: 'building',
      header: 'Building',
      render: (row: Room) => row.building || 'N/A',
    },
    {
      key: 'capacity',
      header: 'Capacity',
      render: (row: Room) => row.capacity,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row: Room) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Room) => (
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
        title="Rooms"
        subtitle="Manage rooms and facilities across campuses"
        actions={
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
        data={rooms as any}
        columns={columns as any}
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
            <select
              className="input-field"
              value={formData.room_type || 'lecture_hall'}
              onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
              required
            >
              <option value="lecture_hall">Lecture Hall</option>
              <option value="lab">Lab</option>
              <option value="seminar_room">Seminar Room</option>
              <option value="conference_room">Conference Room</option>
              <option value="library">Library</option>
              <option value="office">Office</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                className="input-field"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <input
                type="number"
                className="input-field"
                value={formData.floor || ''}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
            <input
              type="text"
              className="input-field"
              value={formData.building || ''}
              onChange={(e) => setFormData({ ...formData, building: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.has_projector}
                onChange={(e) => setFormData({ ...formData, has_projector: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="text-sm">Projector</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.has_whiteboard}
                onChange={(e) => setFormData({ ...formData, has_whiteboard: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="text-sm">Whiteboard</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.has_computers}
                onChange={(e) => setFormData({ ...formData, has_computers: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="text-sm">Computers</span>
            </label>
          </div>
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
      </FormModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Room"
        message={`Are you sure you want to delete ${selectedRoom?.room_number}? This action cannot be undone.`}
        variant="danger"
      />
    </Layout>
  );
}
