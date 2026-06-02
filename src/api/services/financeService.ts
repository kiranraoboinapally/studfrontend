// ==================== FINANCE SERVICE ====================
// Based on backend API: /api/v1/finance/*
import api from '../axios';
import type { 
  ApiResponse,
  PaginatedResponse,
  QueryFilters 
} from '../../types';

// Types for Finance module
interface FeeHead {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_mandatory: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateFeeHead {
  name: string;
  code: string;
  description?: string;
  is_mandatory: boolean;
}

interface FeeStructure {
  id: number;
  program_id: number;
  semester_number: number;
  fee_head_id: number;
  amount: number;
  academic_year: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateFeeStructure {
  program_id: number;
  semester_number: number;
  fee_head_id: number;
  amount: number;
  academic_year: string;
  is_active?: boolean;
}

interface Invoice {
  id: number;
  invoice_number: string;
  student_id: number;
  term_id?: number;
  program_id: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  due_date: string;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
}

interface Scholarship {
  id: number;
  name: string;
  description?: string;
  eligibility_criteria: Record<string, unknown>;
  amount: number;
  renewable: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateScholarship {
  name: string;
  description?: string;
  eligibility_criteria: Record<string, unknown>;
  amount: number;
  renewable?: boolean;
}

const FINANCE_BASE = '/finance';

export const financeService = {
  // Finance Summary
  getSummary: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await api.get<ApiResponse<Record<string, unknown>>>(`${FINANCE_BASE}/summary`);
    return response.data;
  },

  // Fee Heads
  getFeeHeads: async (): Promise<ApiResponse<FeeHead[]>> => {
    const response = await api.get<ApiResponse<FeeHead[]>>(`${FINANCE_BASE}/fee-heads`);
    return response.data;
  },

  createFeeHead: async (data: CreateFeeHead): Promise<ApiResponse<FeeHead>> => {
    const response = await api.post<ApiResponse<FeeHead>>(`${FINANCE_BASE}/fee-heads`, data);
    return response.data;
  },

  updateFeeHead: async (id: number, data: Partial<CreateFeeHead>): Promise<ApiResponse<FeeHead>> => {
    const response = await api.put<ApiResponse<FeeHead>>(`${FINANCE_BASE}/fee-heads/${id}`, data);
    return response.data;
  },

  // Fee Structures
  getFeeStructures: async (filters?: QueryFilters): Promise<PaginatedResponse<FeeStructure>> => {
    const response = await api.get<PaginatedResponse<FeeStructure>>(`${FINANCE_BASE}/fee-structures`, { params: filters });
    return response.data;
  },

  createFeeStructure: async (data: CreateFeeStructure): Promise<ApiResponse<FeeStructure>> => {
    const response = await api.post<ApiResponse<FeeStructure>>(`${FINANCE_BASE}/fee-structures`, data);
    return response.data;
  },

  // Invoices
  getInvoices: async (filters?: QueryFilters): Promise<PaginatedResponse<Invoice>> => {
    const response = await api.get<PaginatedResponse<Invoice>>(`${FINANCE_BASE}/invoices`, { params: filters });
    return response.data;
  },

  getStudentInvoices: async (studentId: number): Promise<ApiResponse<Invoice[]>> => {
    const response = await api.get<ApiResponse<Invoice[]>>(`${FINANCE_BASE}/invoices/student/${studentId}`);
    return response.data;
  },

  getMyInvoices: async (): Promise<ApiResponse<Invoice[]>> => {
    const response = await api.get<ApiResponse<Invoice[]>>(`${FINANCE_BASE}/invoices/me`);
    return response.data;
  },

  generateInvoice: async (data: { student_id: number; term_id: number; program_id: number }): Promise<ApiResponse<Invoice>> => {
    const response = await api.post<ApiResponse<Invoice>>(`${FINANCE_BASE}/invoices/generate`, data);
    return response.data;
  },

  // Payments
  getPayments: async (filters?: QueryFilters): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get<PaginatedResponse<Payment>>(`${FINANCE_BASE}/payments`, { params: filters });
    return response.data;
  },

  processPayment: async (data: {
    invoice_id: number;
    student_id: number;
    amount: number;
    transaction_id: string;
    payment_mode_id: number;
  }): Promise<ApiResponse<Payment>> => {
    const response = await api.post<ApiResponse<Payment>>(`${FINANCE_BASE}/payments`, data);
    return response.data;
  },

  approvePayment: async (paymentId: number): Promise<ApiResponse<Payment>> => {
    const response = await api.post<ApiResponse<Payment>>(`${FINANCE_BASE}/payments/${paymentId}/approve`);
    return response.data;
  },

  // Scholarships
  getScholarships: async (): Promise<ApiResponse<Scholarship[]>> => {
    const response = await api.get<ApiResponse<Scholarship[]>>(`${FINANCE_BASE}/scholarships`);
    return response.data;
  },

  createScholarship: async (data: CreateScholarship): Promise<ApiResponse<Scholarship>> => {
    const response = await api.post<ApiResponse<Scholarship>>(`${FINANCE_BASE}/scholarships`, data);
    return response.data;
  },

  assignScholarship: async (data: {
    student_id: number;
    scholarship_id: number;
    academic_year: string;
    amount_awarded: number;
  }): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${FINANCE_BASE}/scholarships/assign`, data);
    return response.data;
  },

  getStudentScholarships: async (studentId: number): Promise<ApiResponse<Record<string, unknown>[]>> => {
    const response = await api.get<ApiResponse<Record<string, unknown>[]>>(`${FINANCE_BASE}/scholarships/student/${studentId}`);
    return response.data;
  },

  // Discounts
  createDiscount: async (data: {
    student_id: number;
    fee_head_id: number;
    academic_year: string;
    amount: number;
    reason: string;
  }): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${FINANCE_BASE}/discounts`, data);
    return response.data;
  },

  getStudentDiscounts: async (studentId: number): Promise<ApiResponse<Record<string, unknown>[]>> => {
    const response = await api.get<ApiResponse<Record<string, unknown>[]>>(`${FINANCE_BASE}/discounts/student/${studentId}`);
    return response.data;
  },

  // Installments
  createInstallment: async (data: {
    student_id: number;
    academic_term_id: number;
    due_date: string;
    amount: number;
  }): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${FINANCE_BASE}/installments`, data);
    return response.data;
  },

  getStudentInstallments: async (studentId: number): Promise<ApiResponse<Record<string, unknown>[]>> => {
    const response = await api.get<ApiResponse<Record<string, unknown>[]>>(`${FINANCE_BASE}/installments/student/${studentId}`);
    return response.data;
  },

  // Refunds
  requestRefund: async (data: {
    payment_id: number;
    student_id: number;
    amount: number;
    reason: string;
  }): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${FINANCE_BASE}/refunds`, data);
    return response.data;
  },

  approveRefund: async (refundId: number): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${FINANCE_BASE}/refunds/${refundId}/approve`);
    return response.data;
  },

  getRefunds: async (): Promise<ApiResponse<Record<string, unknown>[]>> => {
    const response = await api.get<ApiResponse<Record<string, unknown>[]>>(`${FINANCE_BASE}/refunds`);
    return response.data;
  },
};

export default financeService;
