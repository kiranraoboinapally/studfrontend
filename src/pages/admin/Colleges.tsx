import { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout";
import PageHeader from "../../components/shared/PageHeader";
import Modal from "../../components/shared/Modal";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import api from "../../api/axios";
import { Plus, Building2, Pencil, Trash2, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import type { Campus } from "../../types";

export default function AdminColleges() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);

  const [form, setForm] = useState({
    university_id: "",
    name: "",
    code: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
    is_main_campus: false,
    is_active: true,
  });

  const fetchUniversities = async () => {
    try {
      const res = await api.get("/api/v1/universities");
      setUniversities(res.data.data || []);
    } catch {
      toast.error("Failed to load universities");
    }
  };

  const fetchCampuses = async () => {
    try {
      const res = await api.get("/api/v1/campuses");
      setCampuses(res.data.data || []);
    } catch {
      toast.error("Failed to load campuses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
    fetchCampuses();
  }, []);

  const openCreate = () => {
    setEditingCampus(null);
    setForm({
      university_id: "",
      name: "",
      code: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      phone: "",
      is_main_campus: false,
      is_active: true,
    });
    setModal(true);
  };

  const handleEdit = (campus: Campus) => {
    setEditingCampus(campus);
    setForm({
      university_id: campus.university_id?.toString() || "",
      name: campus.name || "",
      code: campus.code || "",
      address: campus.address || "",
      city: campus.city || "",
      state: campus.state || "",
      postal_code: campus.postal_code || "",
      phone: campus.phone || "",
      is_main_campus: campus.is_main_campus || false,
      is_active: campus.is_active ?? true,
    });
    setModal(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        university_id: parseInt(form.university_id),
      };

      if (editingCampus) {
        await api.put(`/api/v1/campuses/${editingCampus.id}`, payload);
        toast.success("Campus updated!");
      } else {
        await api.post("/api/v1/campuses", payload);
        toast.success("Campus created!");
      }

      setModal(false);
      fetchCampuses();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Operation failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/api/v1/campuses/${id}`);
      toast.success("Deleted!");
      fetchCampuses();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Campuses"
        subtitle="Manage university campuses"
        actions={
          <button onClick={openCreate} className="btn-primary flex gap-2">
            <Plus className="w-4 h-4" /> Add Campus
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {campuses.map((c) => (
          <div key={c.id} className="card">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{c.name}</h3>
                  {c.is_main_campus && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Main</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Code: {c.code}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {c.city}, {c.state}
                </p>
                <p className="text-sm text-primary-600">{c.phone}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(c)}
                    className="btn-secondary flex items-center gap-1 text-sm"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(c.id)}
                    className="btn-danger flex items-center gap-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title={editingCampus ? "Edit Campus" : "Add Campus"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={form.university_id}
            onChange={(e) => setForm({ ...form, university_id: e.target.value })}
            className="input-field"
            required
          >
            <option value="">Select University</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
            placeholder="Campus Name"
            required
          />

          <input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="input-field"
            placeholder="Code"
            required
          />

          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="input-field"
            placeholder="Address"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="input-field"
              placeholder="City"
            />
            <input
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="input-field"
              placeholder="State"
            />
          </div>

          <input
            value={form.postal_code}
            onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
            className="input-field"
            placeholder="Postal Code"
          />

          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input-field"
            placeholder="Phone"
          />

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_main_campus}
                onChange={(e) => setForm({ ...form, is_main_campus: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="text-sm">Main Campus</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="text-sm">Active</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button className="btn-primary flex-1">
              {editingCampus ? "Update" : "Create"}
            </button>

            <button
              type="button"
              onClick={() => setModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}