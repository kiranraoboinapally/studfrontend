// ==================== ADMISSION PORTAL TYPES ====================
// Complete admission system with enquiry, registration, and multi-step application

// Enquiry & Lead Registration
export interface EnquiryForm {
  full_name: string;
  mobile_number: string;
  email_address: string;
  country: string;
  state: string;
  district: string;
  preferred_campus: string;
  qualification_type: QualificationType;
  qualification?: string;
  faculty?: string;
  department?: string;
  program?: string;
  specialization?: string;
}

export type QualificationType = 
  | 'Certificate'
  | 'Diploma'
  | 'Advanced Diploma'
  | 'UG'
  | 'PG'
  | 'PG Diploma'
  | 'Doctorate'
  | 'Not Decided';

export interface QualificationFlow {
  qualification_type: QualificationType;
  qualifications: Qualification[];
  faculties: Faculty[];
  departments: Department[];
  programs: Program[];
  specializations: Specialization[];
}

export interface Qualification {
  id: number;
  name: string;
  type: QualificationType;
}

export interface Faculty {
  id: number;
  name: string;
  code: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  faculty_id: number;
}

export interface Program {
  id: number;
  name: string;
  code: string;
  department_id: number;
  qualification_type: QualificationType;
}

export interface Specialization {
  id: number;
  name: string;
  program_id: number;
}

// OTP Verification
export interface OTPVerification {
  mobile_otp: string;
  email_otp: string;
  mobile_verified: boolean;
  email_verified: boolean;
}

// Student Portal Dashboard
export interface StudentDashboard {
  application_status: ApplicationStatus;
  admission_progress: AdmissionProgress;
  scholarship_status: ScholarshipStatus;
  pending_tasks: PendingTask[];
  recent_notifications: Notification[];
}

export interface ApplicationStatus {
  status: string;
  application_id: string;
  program_applied: string;
  submitted_date: string;
}

export interface AdmissionProgress {
  current_stage: string;
  completed_stages: string[];
  total_stages: number;
  percentage: number;
}

export interface ScholarshipStatus {
  type: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  amount?: number;
  percentage?: number;
}

export interface PendingTask {
  id: number;
  task: string;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

// Multi-Step Admission Wizard

// Step 1: Personal Details
export interface PersonalDetails {
  // Applicant Information
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  nationality: string;
  mother_tongue: string;
  religion: string;
  category: string;
  marital_status: string;
  aadhaar_number?: string;
  passport_number?: string;
  
  // Disability
  physically_challenged: boolean;
  disability_type?: string;
  disability_percentage?: number;
  
  // Parent/Guardian Details
  guardian_type: 'father' | 'mother' | 'guardian';
  guardian_name: string;
  guardian_occupation: string;
  guardian_annual_income: number;
  guardian_mobile: string;
  guardian_email: string;
  
  // Permanent Address
  permanent_address_line1: string;
  permanent_address_line2?: string;
  permanent_country: string;
  permanent_state: string;
  permanent_district: string;
  permanent_city: string;
  permanent_pin_code: string;
  
  // Correspondence Address
  same_as_permanent: boolean;
  correspondence_address_line1?: string;
  correspondence_address_line2?: string;
  correspondence_country?: string;
  correspondence_state?: string;
  correspondence_district?: string;
  correspondence_city?: string;
  correspondence_pin_code?: string;
}

// Step 2: Application Payment
export interface ApplicationPayment {
  application_fee: number;
  payment_method: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Offline Payment';
  payment_status: 'pending' | 'processing' | 'completed' | 'failed';
  transaction_id?: string;
  payment_date?: string;
  receipt_url?: string;
}

export interface PaymentReceipt {
  receipt_number: string;
  transaction_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  applicant_name: string;
  program: string;
}

// Step 3: Academic Details
export interface AcademicDetails {
  // 10th Qualification
  tenth_board: string;
  tenth_school: string;
  tenth_year: string;
  tenth_percentage: number;
  
  // 12th Qualification
  twelfth_board: string;
  twelfth_school: string;
  twelfth_year: string;
  twelfth_percentage: number;
  
  // Diploma Details (Conditional)
  has_diploma: boolean;
  diploma_institute?: string;
  diploma_university?: string;
  diploma_percentage?: number;
  diploma_passing_year?: string;
  
  // UG Details (For PG Admissions)
  has_ug: boolean;
  ug_degree?: string;
  ug_university?: string;
  ug_cgpa?: number;
  ug_percentage?: number;
  ug_passing_year?: string;
  
  // Entrance Exam Details
  entrance_exam_name?: string;
  entrance_exam_score?: number;
  entrance_exam_rank?: number;
}

// Step 4: Document Upload
export interface DocumentUpload {
  document_type: DocumentType;
  file_name: string;
  file_size: number;
  file_type: string;
  upload_status: 'uploading' | 'uploaded' | 'failed';
  file_url?: string;
  upload_progress?: number;
}

export type DocumentType =
  | 'passport_photo'
  | 'signature'
  | 'aadhaar_card'
  | 'tenth_marksheet'
  | 'twelfth_marksheet'
  | 'transfer_certificate'
  | 'migration_certificate'
  | 'category_certificate'
  | 'income_certificate'
  | 'disability_certificate';

export interface UploadedDocuments {
  passport_photo?: DocumentUpload;
  signature?: DocumentUpload;
  aadhaar_card?: DocumentUpload;
  tenth_marksheet?: DocumentUpload;
  twelfth_marksheet?: DocumentUpload;
  transfer_certificate?: DocumentUpload;
  migration_certificate?: DocumentUpload;
  category_certificate?: DocumentUpload;
  income_certificate?: DocumentUpload;
  disability_certificate?: DocumentUpload;
}

// Step 5: Scholarship Application
export interface ScholarshipApplication {
  apply_for_scholarship: boolean;
  scholarship_types: ScholarshipType[];
  merit_scholarship?: MeritScholarship;
  financial_assistance?: FinancialAssistance;
  sports_scholarship?: SportsScholarship;
  reserved_category?: ReservedCategory;
  special_scholarship?: SpecialScholarship;
}

export type ScholarshipType =
  | 'merit'
  | 'sports'
  | 'financial_assistance'
  | 'reserved_category'
  | 'special';

export interface MeritScholarship {
  tenth_percentage: number;
  twelfth_percentage: number;
}

export interface FinancialAssistance {
  annual_family_income: number;
  income_certificate?: DocumentUpload;
}

export interface SportsScholarship {
  sports_level: string;
  achievement_details: string;
  certificate?: DocumentUpload;
}

export interface ReservedCategory {
  category_certificate?: DocumentUpload;
}

export interface SpecialScholarship {
  scholarship_type: string;
  supporting_documents?: DocumentUpload[];
}

export interface ScholarshipEligibility {
  eligible: boolean;
  estimated_amount: number;
  estimated_percentage: number;
  matching_scholarships: ScholarshipType[];
}

// Step 6: Declaration
export interface Declaration {
  declaration_accepted: boolean;
  declaration_date?: string;
  application_submitted: boolean;
  submission_date?: string;
}

// Complete Application
export interface AdmissionApplication {
  id?: number;
  enquiry_id?: number;
  cycle_id: number;
  program_id: number;
  personal_details: PersonalDetails;
  payment: ApplicationPayment;
  academic_details: AcademicDetails;
  documents: UploadedDocuments;
  scholarship: ScholarshipApplication;
  declaration: Declaration;
  status: ApplicationStage;
  created_at?: string;
  updated_at?: string;
}

export type ApplicationStage =
  | 'enquiry_submitted'
  | 'lead_assigned'
  | 'counsellor_contacted'
  | 'registered'
  | 'application_in_progress'
  | 'application_submitted'
  | 'scholarship_requested'
  | 'scholarship_under_review'
  | 'scholarship_approved'
  | 'payment_completed'
  | 'document_verification'
  | 'admission_approved'
  | 'enrollment_completed';

// Application Tracking Timeline
export interface TimelineEvent {
  stage: ApplicationStage;
  title: string;
  description: string;
  date?: string;
  status: 'completed' | 'current' | 'pending';
  icon?: string;
}

// Payment History
export interface PaymentRecord {
  transaction_id: string;
  date: string;
  amount: number;
  payment_method: string;
  status: 'success' | 'pending' | 'failed' | 'refunded';
  receipt_url: string;
  description: string;
}

// Profile
export interface StudentProfile {
  personal_info: PersonalDetails;
  academic_info: AcademicDetails;
  documents: UploadedDocuments;
  contact_info: {
    email: string;
    mobile: string;
    emergency_contact: string;
  };
  editable: boolean;
}

// University Admin User Management
export interface UniversityAdmin {
  id: number;
  username: string;
  email: string;
  role: 'university_admin' | 'admission_manager' | 'counsellor' | 'admission_officer' | 'scholarship_officer' | 'finance_controller' | 'registrar' | 'college_admin' | 'hod' | 'faculty' | 'auditor';
  permissions: string[];
  created_at: string;
  last_login?: string;
  status: 'active' | 'inactive';
}

export interface CreateUserForm {
  username: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
}

// Sidebar Navigation Items
export interface SidebarItem {
  label: string;
  icon: any;
  path: string;
  badge?: number;
}

// Form Validation
export interface FormErrors {
  [key: string]: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
