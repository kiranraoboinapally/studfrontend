import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout";
import PageHeader from "../../components/shared/PageHeader";
import Modal from "../../components/shared/Modal";
import StatusBadge from "../../components/shared/StatusBadge";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { financeService } from "../../api/services/financeService";
import { applicantService } from "../../api/services/admissionService";
import { useForm } from "react-hook-form";
import {
  CheckCircle, XCircle, DollarSign, FileText, Award, Search,
  Filter, Download, Eye, ChevronRight, AlertCircle, IndianRupee,
  GraduationCap, Clock, UserCheck, Receipt, CreditCard
} from "lucide-react";
import toast from "react-hot-toast";

interface EnrollmentForm {
  enrollment_number: string;
  remarks?: string;
}

interface Payment {
  id: number;
  invoice_id: number;
  student_id: number;
  amount: number;
  transaction_id: string;
  payment_mode_id: number;
  status: 'pending' | 'success' | 'failed';
  payment_date: string;
  student?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  invoice?: {
    id: number;
    invoice_number: string;
    total_amount: number;
    balance_amount: number;
  };
}

export default function FinanceTeamDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"payments" | "invoices">("payments");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EnrollmentForm>();

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await financeService.getPayments();
      setPayments(response.data || []);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await financeService.getInvoices();
      setInvoices(response.data || []);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "payments") {
      fetchPayments();
    } else {
      fetchInvoices();
    }
  }, [activeTab]);

  const handleApprovePayment = async () => {
    if (!selectedPayment) return;
    
    try {
      await financeService.approvePayment(selectedPayment.id);
      toast.success("Payment approved successfully");
      setShowApprovalModal(false);
      setSelectedPayment(null);
      fetchPayments();
    } catch (err) {
      toast.error("Failed to approve payment");
    }
  };

  const handleGenerateEnrollment = async (data: EnrollmentForm) => {
    if (!selectedInvoice) return;
    
    try {
      // Update the applicant/student with enrollment number
      // This would typically call a student service endpoint
      await applicantService.update(selectedInvoice.student_id, {
        enrollment_number: data.enrollment_number,
      } as any);
      
      toast.success("Enrollment number generated successfully");
      setShowEnrollmentModal(false);
      reset();
      fetchInvoices();
    } catch (err) {
      toast.error("Failed to generate enrollment number");
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.student?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getPaymentStatusBadge = (status: string) => {
    const badges = {
      pending: { color: "bg-yellow-100 text-yellow-700", label: "Pending" },
      success: { color: "bg-green-100 text-green-700", label: "Success" },
      failed: { color: "bg-red-100 text-red-700", label: "Failed" },
    };
    
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  return (
    <Layout>
      <PageHeader
        title="Finance Team Dashboard"
        subtitle="Approve payments, generate enrollment numbers, and manage finances"
      />

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "payments"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "invoices"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Invoices & Enrollment
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === "payments" ? "Search payments..." : "Search invoices..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          >
            <option value="all">All Status</option>
            {activeTab === "payments" ? (
              <>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </>
            ) : (
              <>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total Collected</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-500">Pending Approvals</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
              <p className="text-xs text-gray-500">Total Invoices</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {invoices.filter(i => i.enrollment_number).length}
              </p>
              <p className="text-xs text-gray-500">Enrolled Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      {activeTab === "payments" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Student", "Transaction ID", "Amount", "Date", "Status", "Actions"]
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
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.student?.first_name} {payment.student?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{payment.student?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {payment.transaction_id}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {getPaymentStatusBadge(payment.status)}
                    </td>
                    <td className="px-4 py-3">
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowApprovalModal(true);
                          }}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve Payment"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No payments found</p>
            </div>
          )}
        </div>
      )}

      {/* Invoices Table */}
      {activeTab === "invoices" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Invoice Number", "Student", "Total Amount", "Balance", "Status", "Enrollment", "Actions"]
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
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {invoice.student?.first_name} {invoice.student?.last_name}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ₹{invoice.total_amount?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      ₹{invoice.balance_amount?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={invoice.status?.toLowerCase() || "pending"} />
                    </td>
                    <td className="px-4 py-3">
                      {invoice.enrollment_number ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          <GraduationCap className="w-3 h-3" />
                          {invoice.enrollment_number}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {invoice.status === 'paid' && !invoice.enrollment_number && (
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowEnrollmentModal(true);
                            }}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Generate Enrollment"
                          >
                            <GraduationCap className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowInvoiceModal(true);
                          }}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredInvoices.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No invoices found</p>
            </div>
          )}
        </div>
      )}

      {/* Payment Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title="Approve Payment"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">Student:</span>
                <span className="font-medium">
                  {selectedPayment.student?.first_name} {selectedPayment.student?.last_name}
                </span>
                <span className="text-gray-500">Amount:</span>
                <span className="font-semibold">₹{selectedPayment.amount.toLocaleString()}</span>
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono text-xs">{selectedPayment.transaction_id}</span>
                <span className="text-gray-500">Payment Date:</span>
                <span className="font-medium">{new Date(selectedPayment.payment_date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Approve Payment</p>
                  <p className="text-sm text-green-800">
                    Once approved, the payment will be marked as successful and the student can proceed with enrollment.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleApprovePayment}
                className="btn-primary flex-1"
              >
                Approve Payment
              </button>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Enrollment Generation Modal */}
      <Modal
        isOpen={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        title="Generate Enrollment Number"
      >
        {selectedInvoice && (
          <form onSubmit={handleSubmit(handleGenerateEnrollment)} className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Student Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">Student:</span>
                <span className="font-medium">
                  {selectedInvoice.student?.first_name} {selectedInvoice.student?.last_name}
                </span>
                <span className="text-gray-500">Invoice:</span>
                <span className="font-mono text-xs">{selectedInvoice.invoice_number}</span>
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-semibold text-green-600">
                  ₹{selectedInvoice.total_amount?.toLocaleString() || 0}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enrollment Number *
              </label>
              <input
                type="text"
                {...register("enrollment_number", { 
                  required: "Enrollment number is required",
                  pattern: {
                    value: /^[A-Z0-9-]+$/,
                    message: "Only uppercase letters, numbers, and hyphens allowed"
                  }
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                placeholder="e.g., 2026-CS-001"
              />
              {errors.enrollment_number && (
                <p className="text-red-600 text-sm mt-1">{errors.enrollment_number.message}</p>
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Important</p>
                  <p className="text-sm text-blue-800">
                    The enrollment number will be used for all academic records and cannot be changed once generated.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1">
                Generate Enrollment
              </button>
              <button
                type="button"
                onClick={() => setShowEnrollmentModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Invoice Details Modal */}
      <Modal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        title="Invoice Details"
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Invoice Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">Invoice Number:</span>
                <span className="font-mono text-xs">{selectedInvoice.invoice_number}</span>
                <span className="text-gray-500">Student:</span>
                <span className="font-medium">
                  {selectedInvoice.student?.first_name} {selectedInvoice.student?.last_name}
                </span>
                <span className="text-gray-500">Total Amount:</span>
                <span className="font-semibold">₹{selectedInvoice.total_amount?.toLocaleString() || 0}</span>
                <span className="text-gray-500">Paid Amount:</span>
                <span className="font-semibold text-green-600">
                  ₹{selectedInvoice.paid_amount?.toLocaleString() || 0}
                </span>
                <span className="text-gray-500">Balance:</span>
                <span className="font-semibold text-red-600">
                  ₹{selectedInvoice.balance_amount?.toLocaleString() || 0}
                </span>
                <span className="text-gray-500">Status:</span>
                <span>
                  <StatusBadge status={selectedInvoice.status?.toLowerCase() || "pending"} />
                </span>
                <span className="text-gray-500">Enrollment Number:</span>
                <span className="font-mono text-xs">
                  {selectedInvoice.enrollment_number || "Not generated"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowInvoiceModal(false)}
              className="w-full btn-secondary"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
