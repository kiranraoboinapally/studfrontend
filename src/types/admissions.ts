// ==================== ADMISSIONS MODULE TYPES ====================
// Based on backend API: /api/v1/admissions/*

// Admission Cycles (Backend API Module)
export interface AdmissionApiCycle {
  id: number;
  name: string;
  academic_year: string;
  start_date: string;
  end_date: string;
  status_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  status?: StatusCode;
  stats?: CycleStats;
}

export interface CreateAdmissionApiCycle {
  name: string;
  academic_year: string;
  start_date?: string;
  end_date?: string;
  status_id?: number;
}

export interface UpdateAdmissionApiCycle {
  name?: string;
  academic_year?: string;
  start_date?: string;
  end_date?: string;
  status_id?: number;
  is_active?: boolean;
}

// Cycle Statistics
export interface CycleStats {
  total_applications: number;
  approved_applications: number;
  rejected_applications: number;
  pending_applications: number;
  total_seats: number;
  allocated_seats: number;
  available_seats: number;
}

// Applicants (Backend API Module)
export interface AdmissionApiApplicant {
  id: number;
  cycle_id: number;
  program_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender_id: number;
  category_id: number;
  address: string;
  previous_qualification: string;
  previous_percentage: number;
  status_id: number;
  created_at: string;
  updated_at: string;
  // New fields for hostel, transport, scholarship
  hostel_required?: boolean;
  hostel_type?: 'ac' | 'non_ac';
  transport_required?: boolean;
  scholarship_status?: 'none' | 'state_topper' | 'state_player';
  stream_id?: number;
  mission_fee?: number;
  enrollment_number?: string;
  cycle?: AdmissionApiCycle;
  program?: Program;
  gender?: Lookup;
  category?: Lookup;
  status?: StatusCode;
  documents?: ApplicantDocument[];
  seat_allocation?: SeatAllocation;
}

export interface CreateAdmissionApiApplicant {
  cycle_id: number;
  program_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender_id: number;
  category_id: number;
  address: string;
  previous_qualification: string;
  previous_percentage: number;
  // New fields for hostel, transport, scholarship
  hostel_required?: boolean;
  hostel_type?: 'ac' | 'non_ac';
  transport_required?: boolean;
  scholarship_status?: 'none' | 'state_topper' | 'state_player';
  stream_id?: number;
}

export interface UpdateAdmissionApiApplicant {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status_id?: number;
  hostel_required?: boolean;
  hostel_type?: 'ac' | 'non_ac';
  transport_required?: boolean;
  scholarship_status?: 'none' | 'state_topper' | 'state_player';
  stream_id?: number;
  mission_fee?: number;
}

export interface UpdateAdmissionApiApplicantStatus {
  status_id: number;
}

// Applicant Documents
export interface ApplicantDocument {
  id: number;
  applicant_id: number;
  document_type: string;
  file_path: string;
  verified: boolean;
  verified_at?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicantDocument {
  document_type: string;
  file_path: string;
  verified?: boolean;
}

export interface VerifyDocument {
  verified: boolean;
  remarks?: string;
}

// Seat Allocation
export interface SeatAllocation {
  id: number;
  applicant_id: number;
  program_id: number;
  batch_id: number;
  seat_type: 'merit' | 'management' | 'nri' | 'sports_quota' | 'other';
  allocation_date: string;
  created_at: string;
  updated_at: string;
  applicant?: AdmissionApiApplicant;
  program?: Program;
  batch?: Batch;
}

export interface CreateSeatAllocation {
  applicant_id: number;
  program_id: number;
  batch_id: number;
  seat_type: 'merit' | 'management' | 'nri' | 'sports_quota' | 'other';
}

// Waitlist
export interface WaitlistEntry {
  id: number;
  applicant_id: number;
  program_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  applicant?: AdmissionApiApplicant;
  program?: Program;
}

export interface CreateWaitlistEntry {
  applicant_id: number;
  program_id: number;
  position: number;
}

// Import types from other modules
interface StatusCode {
  id: number;
  code: string;
  name: string;
}

interface Program {
  id: number;
  name: string;
  code: string;
  department_id: number;
}

interface Lookup {
  id: number;
  name: string;
  code?: string;
}

interface Batch {
  id: number;
  program_id: number;
  batch_year: number;
  name: string;
}
