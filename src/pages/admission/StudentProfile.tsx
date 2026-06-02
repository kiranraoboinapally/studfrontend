import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, User, Mail, Phone, MapPin, Save, Edit2, X } from "lucide-react";
import toast from "react-hot-toast";
import type { StudentProfile } from "../../types/admissionPortal";
import { getStudentProfile, updateStudentProfile } from "../../api/services/admissionPortalService";

const profileSchema = z.object({
  email: z.string().email("Invalid email"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  emergency_contact: z.string().min(10, "Invalid contact number"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function StudentProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getStudentProfile();
      if (response.success) {
        setProfile(response.data || null);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile(getMockProfile());
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const response = await updateStudentProfile({
        ...profile,
        contact_info: {
          email: data.email,
          mobile: data.mobile,
          emergency_contact: data.emergency_contact,
        },
      });
      if (response.success) {
        toast.success("Profile updated successfully!");
        setEditing(false);
        loadProfile();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const data = profile || getMockProfile();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-2 text-primary-200 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-primary-200">Manage your personal information</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">John Smith</h2>
              <p className="text-gray-600 mb-4">APP2024001</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Active
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(false)}
                    className="text-gray-600 hover:text-gray-700 flex items-center gap-1 text-sm"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          {...register("email")}
                          defaultValue={data.contact_info.email}
                          className="input-field pl-10"
                        />
                      </div>
                      {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          {...register("mobile")}
                          defaultValue={data.contact_info.mobile}
                          className="input-field pl-10"
                        />
                      </div>
                      {errors.mobile && <p className="text-red-600 text-xs mt-1">{errors.mobile.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          {...register("emergency_contact")}
                          defaultValue={data.contact_info.emergency_contact}
                          className="input-field pl-10"
                        />
                      </div>
                      {errors.emergency_contact && <p className="text-red-600 text-xs mt-1">{errors.emergency_contact.message}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{data.contact_info.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Mobile</p>
                      <p className="font-medium text-gray-900">{data.contact_info.mobile}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Emergency Contact</p>
                      <p className="font-medium text-gray-900">{data.contact_info.emergency_contact}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Information (Read-only) */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">John Smith</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900">15 May 2004</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-900">Male</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">General</p>
                </div>
              </div>
            </div>

            {/* Address (Read-only) */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Address</h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">123 Main Street, Mumbai</p>
                  <p className="text-gray-600">Maharashtra, 400001</p>
                  <p className="text-gray-600">India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// function getMockProfile(): StudentProfile {
//   return {
//     personal_info: {
//       first_name: "John",
//       last_name: "Smith",
//       date_of_birth: "2004-05-15",
//       gender: "male",
//       category: "general",
//     } as any,
//     academic_info: {} as any,
//     documents: {} as any,
//     contact_info: {
//       email: "john.smith@example.com",
//       mobile: "9876543210",
//       emergency_contact: "9876543211",
//     },
//     editable: true,
//   };
// }
