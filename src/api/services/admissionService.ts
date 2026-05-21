// ==================== ADMISSIONS SERVICE ====================
// Based on backend API: /api/v1/admissions/*
import api from '../axios';
import type { 
  AdmissionApiCycle,
  CreateAdmissionApiCycle,
  UpdateAdmissionApiCycle,
  CycleStats,
  AdmissionApiApplicant,
  CreateAdmissionApiApplicant,
  UpdateAdmissionApiApplicant,
  UpdateAdmissionApiApplicantStatus,
  ApplicantDocument,
  CreateApplicantDocument,
  VerifyDocument,
  SeatAllocation,
  CreateSeatAllocation,
  WaitlistEntry,
  CreateWaitlistEntry,
  ApiResponse,
  PaginatedResponse,
  QueryFilters
} from '../../types';

const ADMISSIONS_BASE = '/admissions';

// Admission Cycles
export const admissionCycleService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<AdmissionApiCycle>> => {
    const response = await api.get<PaginatedResponse<AdmissionApiCycle>>(`${ADMISSIONS_BASE}/cycles`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<AdmissionApiCycle>> => {
    const response = await api.get<ApiResponse<AdmissionApiCycle>>(`${ADMISSIONS_BASE}/cycles/${id}`);
    return response.data;
  },

  create: async (data: CreateAdmissionApiCycle): Promise<ApiResponse<AdmissionApiCycle>> => {
    const response = await api.post<ApiResponse<AdmissionApiCycle>>(`${ADMISSIONS_BASE}/cycles`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateAdmissionApiCycle): Promise<ApiResponse<AdmissionApiCycle>> => {
    const response = await api.put<ApiResponse<AdmissionApiCycle>>(`${ADMISSIONS_BASE}/cycles/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${ADMISSIONS_BASE}/cycles/${id}`);
    return response.data;
  },

  getOpenCycles: async (): Promise<ApiResponse<AdmissionApiCycle[]>> => {
    const response = await api.get<ApiResponse<AdmissionApiCycle[]>>(`${ADMISSIONS_BASE}/cycles/open`);
    return response.data;
  },

  getStats: async (id: number): Promise<ApiResponse<CycleStats>> => {
    const response = await api.get<ApiResponse<CycleStats>>(`${ADMISSIONS_BASE}/cycles/${id}/stats`);
    return response.data;
  },
};

// Applicants
export const applicantService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<AdmissionApiApplicant>> => {
    const response = await api.get<PaginatedResponse<AdmissionApiApplicant>>(`${ADMISSIONS_BASE}/applicants`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<AdmissionApiApplicant>> => {
    const response = await api.get<ApiResponse<AdmissionApiApplicant>>(`${ADMISSIONS_BASE}/applicants/${id}`);
    return response.data;
  },

  create: async (data: CreateAdmissionApiApplicant): Promise<ApiResponse<AdmissionApiApplicant>> => {
    const response = await api.post<ApiResponse<AdmissionApiApplicant>>(`${ADMISSIONS_BASE}/applicants`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateAdmissionApiApplicant): Promise<ApiResponse<AdmissionApiApplicant>> => {
    const response = await api.put<ApiResponse<AdmissionApiApplicant>>(`${ADMISSIONS_BASE}/applicants/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: number, data: UpdateAdmissionApiApplicantStatus): Promise<ApiResponse<AdmissionApiApplicant>> => {
    const response = await api.put<ApiResponse<AdmissionApiApplicant>>(`${ADMISSIONS_BASE}/applicants/${id}/status`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${ADMISSIONS_BASE}/applicants/${id}`);
    return response.data;
  },
};

// Applicant Documents
export const applicantDocumentService = {
  uploadDocument: async (applicantId: number, data: CreateApplicantDocument): Promise<ApiResponse<ApplicantDocument>> => {
    const response = await api.post<ApiResponse<ApplicantDocument>>(`${ADMISSIONS_BASE}/applicants/${applicantId}/documents`, data);
    return response.data;
  },

  verifyDocument: async (documentId: number): Promise<ApiResponse<ApplicantDocument>> => {
    const response = await api.post<ApiResponse<ApplicantDocument>>(`${ADMISSIONS_BASE}/documents/${documentId}/verify`);
    return response.data;
  },

  updateVerification: async (documentId: number, data: VerifyDocument): Promise<ApiResponse<ApplicantDocument>> => {
    const response = await api.put<ApiResponse<ApplicantDocument>>(`${ADMISSIONS_BASE}/documents/${documentId}`, data);
    return response.data;
  },
};

// Seat Allocation
export const seatAllocationService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<SeatAllocation>> => {
    const response = await api.get<PaginatedResponse<SeatAllocation>>(`${ADMISSIONS_BASE}/seat-allocations`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<SeatAllocation>> => {
    const response = await api.get<ApiResponse<SeatAllocation>>(`${ADMISSIONS_BASE}/seat-allocations/${id}`);
    return response.data;
  },

  allocate: async (data: CreateSeatAllocation): Promise<ApiResponse<SeatAllocation>> => {
    const response = await api.post<ApiResponse<SeatAllocation>>(`${ADMISSIONS_BASE}/seat-allocations`, data);
    return response.data;
  },

  deallocate: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${ADMISSIONS_BASE}/seat-allocations/${id}/deallocate`);
    return response.data;
  },
};

// Waitlist
export const waitlistService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<WaitlistEntry>> => {
    const response = await api.get<PaginatedResponse<WaitlistEntry>>(`${ADMISSIONS_BASE}/waitlist`, { params: filters });
    return response.data;
  },

  addToWaitlist: async (data: CreateWaitlistEntry): Promise<ApiResponse<WaitlistEntry>> => {
    const response = await api.post<ApiResponse<WaitlistEntry>>(`${ADMISSIONS_BASE}/waitlist`, data);
    return response.data;
  },

  removeFromWaitlist: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${ADMISSIONS_BASE}/waitlist/${id}`);
    return response.data;
  },
};

// Default export as object
export default { 
  cycles: admissionCycleService,
  applicants: applicantService,
  documents: applicantDocumentService,
  seatAllocations: seatAllocationService,
  waitlist: waitlistService,
};
