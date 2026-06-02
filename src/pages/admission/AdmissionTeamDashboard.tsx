import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout";
import PageHeader from "../../components/shared/PageHeader";
import Modal from "../../components/shared/Modal";
import StatusBadge from "../../components/shared/StatusBadge";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { applicantService, applicantDocumentService, admissionCycleService } from "../../api/services/admissionService";
import { useForm } from "react-hook-form";
import {
  CheckCircle, XCircle, FileText, Award, ShieldCheck, Upload,
  Search, Filter, Download, Eye, ChevronRight, AlertCircle,
  IndianRupee, GraduationCap, Clock, UserCheck
} from "lucide-react";
import toast from "react-hot-toast";
import type { AdmissionApiApplicant, ApplicantDocument, AdmissionApiCycle } from "../../types";

interface MissionFeeForm {
  mission_fee: number;
  remarks?: string;
}

export default function AdmissionTeamDashboard() {
  const [applicants, setApplicants] = useState<AdmissionApiApplicant[]>([]);
  const [cycles, setCycles] = useState<AdmissionApiCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<AdmissionApiApplicant | null>(null);
  const [documents, setDocuments] = useState<ApplicantDocument[]>([]);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showMissionFeeModal, setShowMissionFeeModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MissionFeeForm>();

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (selectedCycle) filters.cycle_id = selectedCycle;
      
      const response = await applicantService.getAll(filters);
      setApplicants(response.data || []);
    } catch (err) {
      console.error("Failed to fetch applicants:", err);
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const fetchCycles = async () => {
    try {
      const response = await admissionCycleService.cycles.getAll();
      setCycles(response.data || []);
    } catch (err) {
      console.error("Failed to fetch cycles:", err);
    }
  };

  const fetchDocuments = async (applicantId: number) => {
    try {
      const response = await applicantDocumentService.getDocuments(applicantId);
      setDocuments(response.data || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [selectedCycle]);

  const handleViewDocuments = (applicant: AdmissionApiApplicant) => {
    setSelectedApplicant(applicant);
    fetchDocuments(applicant.id);
    setShowDocumentModal(true);
  };

  const handleVerifyDocument = async (documentId: number) => {
    try {
      await applicantDocumentService.verifyDocument(documentId);
      toast.success("Document verified successfully");
      if (selectedApplicant) {
        fetchDocuments(selectedApplicant.id);
      }
    } catch (err) {
      toast.error("Failed to verify document");
    }
  };

  const handleAddMissionFee = async (data: MissionFeeForm) => {
    if (!selectedApplicant) return;
    
    try {
      await applicantService.update(selectedApplicant.id, {
        mission_fee: Number(data.mission_fee),
      });
      toast.success("Mission fee added successfully");
      setShowMissionFeeModal(false);
      reset();
      fetchApplicants();
    } catch (err) {
      toast.error("Failed to add mission fee");
    }
  };

  const handleUpdateStatus = async (statusId: number) => {
    if (!selectedApplicant) return;
    
    try {
      await applicantService.updateStatus(selectedApplicant.id, { status_id: statusId });
      toast.success("Application status updated successfully");
      setShowStatusModal(false);
      fetchApplicants();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch = 
      applicant.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "scholarship" && applicant.scholarship_status && applicant.scholarship_status !== 'none') ||
      (statusFilter === "pending" && !applicant.documents?.every(d => d.verified)) ||
      (statusFilter === "verified" && applicant.documents?.every(d => d.verified));
    
    return matchesSearch && matchesStatus;
  });

  const getScholarshipBadge = (status?: string) => {
    if (!status || status === 'none') return null;
    
    const badges = {
      state_topper: { color: "bg-yellow-100 text-yellow-700", icon: Award, label: "State Topper" },
      state_player: { color: "bg-blue-100 text-blue-700", icon: Award, label: "State Player" },
    };
    
    const badge = badges[status as keyof typeof badges];
    if (!badge) return null;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        <badge.icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  return (
    <Layout>
      <PageHeader
        title="Admission Team Dashboard"
        subtitle="Review applications, verify documents, and manage admissions"
      />

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>
          
          <select
            value={selectedCycle || ""}
            onChange={(e) => setSelectedCycle(Number(e.target.value) || null)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          >
            <option value="">All Cycles</option>
            {cycles.map((cycle) => (
              <option key={cycle.id} value={cycle.id}>
                {cycle.name} - {cycle.academic_year}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          >
            <option value="all">All Status</option>
            <option value="scholarship">Scholarship Candidates</option>
            <option value="pending">Pending Verification</option>
            <option value="verified">Verified</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{applicants.length}</p>
              <p className="text-xs text-gray-500">Total Applicants</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {applicants.filter(a => a.scholarship_status && a.scholarship_status !== 'none').length}
              </p>
              <p className="text-xs text-gray-500">Scholarship Candidates</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {applicants.filter(a => !a.documents?.every(d => d.verified)).length}
              </p>
              <p className="text-xs text-gray-500">Pending Verification</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {applicants.filter(a => a.documents?.every(d => d.verified)).length}
              </p>
              <p className="text-xs text-gray-500">Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Applicant", "Program", "Scholarship", "Documents", "Status", "Actions"]
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
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {applicant.first_name} {applicant.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{applicant.email}</p>
                      <p className="text-xs text-gray-400">{applicant.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700">{applicant.program?.name || "—"}</p>
                    <p className="text-xs text-gray-500">{applicant.program?.code || ""}</p>
                  </td>
                  <td className="px-4 py-3">
                    {getScholarshipBadge(applicant.scholarship_status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {applicant.documents?.length || 0} docs
                      </span>
                      {applicant.documents?.some(d => !d.verified) && (
                        <span className="text-xs text-yellow-600">(pending)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge 
                      status={applicant.status?.code?.toLowerCase() || "pending"} 
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDocuments(applicant)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View Documents"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApplicant(applicant);
                          setShowMissionFeeModal(true);
                        }}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Add Mission Fee"
                      >
                        <IndianRupee className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApplicant(applicant);
                          setShowStatusModal(true);
                        }}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Update Status"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredApplicants.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No applicants found</p>
          </div>
        )}
      </div>

      {/* Document Verification Modal */}
      <Modal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        title="Document Verification"
        size="large"
      >
        {selectedApplicant && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Applicant Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{selectedApplicant.first_name} {selectedApplicant.last_name}</span>
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{selectedApplicant.email}</span>
                <span className="text-gray-500">Program:</span>
                <span className="font-medium">{selectedApplicant.program?.name}</span>
                <span className="text-gray-500">Scholarship Status:</span>
                <span className="font-medium capitalize">
                  {selectedApplicant.scholarship_status?.replace('_', ' ') || 'None'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
              {documents.length === 0 ? (
                <p className="text-gray-500 text-sm">No documents uploaded</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {doc.document_type.replace('_', ' ')}
                            </p>
                            <p className="text-xs text-gray-500">{doc.file_path}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.verified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            <button
                              onClick={() => handleVerifyDocument(doc.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              Verify
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedApplicant.scholarship_status && selectedApplicant.scholarship_status !== 'none' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900">Scholarship Candidate</p>
                    <p className="text-sm text-yellow-800">
                      This applicant has {selectedApplicant.scholarship_status === 'state_topper' ? 'State Topper' : 'State Player'} status. 
                      Review their documents carefully for eligibility verification.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Mission Fee Modal */}
      <Modal
        isOpen={showMissionFeeModal}
        onClose={() => setShowMissionFeeModal(false)}
        title="Add Mission Fee"
      >
        <form onSubmit={handleSubmit(handleAddMissionFee)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mission Fee Amount (₹)
            </label>
            <input
              type="number"
              {...register("mission_fee", { required: "Mission fee is required", min: 0 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              placeholder="Enter amount"
            />
            {errors.mission_fee && (
              <p className="text-red-600 text-sm mt-1">{errors.mission_fee.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks (Optional)
            </label>
            <textarea
              {...register("remarks")}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              placeholder="Any additional notes"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              Add Fee
            </button>
            <button
              type="button"
              onClick={() => setShowMissionFeeModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Application Status"
      >
        {selectedApplicant && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                Update status for: <span className="font-semibold">{selectedApplicant.first_name} {selectedApplicant.last_name}</span>
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleUpdateStatus(2)} // Assuming 2 is for shortlisted
                className="w-full p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Shortlist</p>
                    <p className="text-xs text-gray-500">Approve for next round</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleUpdateStatus(3)} // Assuming 3 is for rejected
                className="w-full p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Reject</p>
                    <p className="text-xs text-gray-500">Decline application</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleUpdateStatus(4)} // Assuming 4 is for approved
                className="w-full p-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Approve Admission</p>
                    <p className="text-xs text-gray-500">Final approval for enrollment</p>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowStatusModal(false)}
              className="w-full btn-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
