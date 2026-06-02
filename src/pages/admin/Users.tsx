import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout";
import PageHeader from "../../components/shared/PageHeader";
import Modal from "../../components/shared/Modal";
import StatusBadge from "../../components/shared/StatusBadge";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import authApi from "../../api/services/authService";
import api from "../../api/axios";
import { useForm } from "react-hook-form";
import { Plus, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import { User, College } from "../../types";

interface CreateUserForm {
  username: string;
  email: string;
  password: string;
  role_name: string;
  phone?: string;
  college_id?: number;
}

export default function AdminUsers() {
  const [users, setUsers]       = useState<User[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } =
    useForm<CreateUserForm>();

  const selectedRole = watch("role_name");

  const fetchUsers = async () => {
    try {
      const [u, c] = await Promise.all([
        authApi.users.getAll(),
        api.get("/colleges"),
      ]);
      setUsers(u.data || []);
      setColleges(c.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const onSubmit = async (data: CreateUserForm) => {
    try {
      await authApi.auth.register(data);
      toast.success("User created successfully!");
      reset();
      setModal(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to create user");
    }
  };

  const toggleUser = async (id: number) => {
    try {
      await authApi.users.toggleActive(id);
      toast.success("User status updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  return (
    <Layout>
      <PageHeader
        title="User Management"
        subtitle="Manage all staff and student accounts"
        actions={
          <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create User
          </button>
        }
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["#","Username","Email","Role","Status","Actions"]
                  .map((h) => (
                  <th key={h}
                    className="text-left px-4 py-3 text-xs font-semibold
                               text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u, i) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {u.username}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="badge-info">
                      {u.role_name?.replace(/_/g, " ") || "—"}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3">
                    <StatusBadge status={u.is_active ? "active" : "inactive"} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleUser(u.id)}
                      className="flex items-center gap-1 text-xs text-gray-500
                                 hover:text-primary-600 transition-colors"
                    >
                      {u.is_active
                        ? <ToggleRight className="w-5 h-5 text-green-500" />
                        : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                      {u.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Create New User">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                {...register("username", { required: "Required" })}
                className="input-field"
                placeholder="john_finance"
              />
            </div>
          
              
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email", { required: "Required" })}
              type="email"
              className="input-field"
              placeholder="user@university.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password", { required: "Required" })}
              type="password"
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select {...register("role_name", { required: "Required" })}
              className="input-field">
              <option value="">Select Role</option>
              <option value="admin">University Admin</option>
              <option value="finance_controller">Finance Controller</option>
              <option value="registrar">Registrar</option>
              <option value="college_admin">College Admin</option>
              <option value="hod">Head of Department</option>
              <option value="faculty">Faculty</option>
              <option value="librarian">Librarian</option>
              <option value="hostel_warden">Hostel Warden</option>
              <option value="admission_team">Admission Team</option>
            </select>
          </div>

          {(selectedRole === "college_admin" || selectedRole === "faculty" || selectedRole === "hod") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign College
              </label>
              <select {...register("college_id", { required: selectedRole === "faculty" ? "College is required for faculty" : false })} className="input-field">
                <option value="">Select College</option>
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              Create User
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