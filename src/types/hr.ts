// ==================== HR MODULE TYPES ====================
// Based on backend API: /api/v1/hr/*

// HR Statistics
export interface HRStats {
  total_employees: number;
  active_employees: number;
  on_leave_today: number;
  new_hires_this_month: number;
  departments_count: number;
}

// Designations
export interface Designation {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDesignation {
  code: string;
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateDesignation {
  code?: string;
  name?: string;
  description?: string;
  is_active?: boolean;
}

// Employment Types
export interface EmploymentType {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Leave Types
export interface LeaveType {
  id: number;
  code: string;
  name: string;
  description?: string;
  max_days: number;
  paid: boolean;
  carry_forward: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLeaveType {
  code: string;
  name: string;
  description?: string;
  max_days: number;
  paid: boolean;
  carry_forward?: boolean;
  is_active?: boolean;
}

export interface UpdateLeaveType {
  code?: string;
  name?: string;
  description?: string;
  max_days?: number;
  paid?: boolean;
  carry_forward?: boolean;
  is_active?: boolean;
}

// Salary Components
export interface SalaryComponent {
  id: number;
  code: string;
  name: string;
  type: 'earning' | 'deduction';
  calculation_type: 'fixed' | 'percentage' | 'formula';
  value?: number;
  percentage_of?: string;
  formula?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSalaryComponent {
  code: string;
  name: string;
  type: 'earning' | 'deduction';
  calculation_type: 'fixed' | 'percentage' | 'formula';
  value?: number;
  percentage_of?: string;
  formula?: string;
  is_active?: boolean;
}

export interface UpdateSalaryComponent {
  code?: string;
  name?: string;
  type?: 'earning' | 'deduction';
  calculation_type?: 'fixed' | 'percentage' | 'formula';
  value?: number;
  percentage_of?: string;
  formula?: string;
  is_active?: boolean;
}

// Employees
export interface Employee {
  id: number;
  user_id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  address: string;
  joining_date: string;
  employment_type_id: number;
  department_id: number;
  designation_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  employment_type?: EmploymentType;
  department?: Department;
  designation?: Designation;
  faculty_profile?: FacultyProfile;
  salary?: EmployeeSalary;
  leave_balances?: LeaveBalance[];
}

export interface CreateEmployee {
  user_id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  joining_date: string;
  employment_type_id: number;
  department_id: number;
  designation_id: number;
  is_active?: boolean;
}

export interface UpdateEmployee {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  employment_type_id?: number;
  department_id?: number;
  designation_id?: number;
  is_active?: boolean;
}

// Faculty Profile
export interface FacultyProfile {
  id: number;
  employee_id: number;
  specialization: string;
  qualification: string;
  research_area: string;
  office_hours: string;
  max_load_credits: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFacultyProfile {
  specialization: string;
  qualification: string;
  research_area: string;
  office_hours: string;
  max_load_credits: number;
}

export interface UpdateFacultyProfile {
  specialization?: string;
  qualification?: string;
  research_area?: string;
  office_hours?: string;
  max_load_credits?: number;
}

// Employee Salary
export interface EmployeeSalary {
  id: number;
  employee_id: number;
  effective_from: string;
  effective_to?: string;
  base_pay: number;
  net_salary: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeSalary {
  effective_from: string;
  base_pay: number;
  net_salary: number;
  is_active?: boolean;
}

export interface UpdateEmployeeSalary {
  effective_from?: string;
  effective_to?: string;
  base_pay?: number;
  net_salary?: number;
  is_active?: boolean;
}

// Payroll
export interface PayrollRun {
  id: number;
  employee_id: number;
  month: string;
  year: number;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  pay_date?: string;
  status: 'pending' | 'processed' | 'paid';
  created_at: string;
  updated_at: string;
  employee?: Employee;
}

export interface CreatePayrollRun {
  employee_id: number;
  month: string;
}

// Leave Requests
export interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approved_by?: number;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  employee?: Employee;
  leave_type?: LeaveType;
  approver?: Employee;
}

export interface CreateLeaveRequest {
  employee_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface UpdateLeaveRequest {
  status?: 'approved' | 'rejected' | 'cancelled';
  rejection_reason?: string;
}

// Leave Balances
export interface LeaveBalance {
  id: number;
  employee_id: number;
  leave_type_id: number;
  total_days: number;
  used_days: number;
  balance_days: number;
  carry_forward_days: number;
  academic_year: string;
  created_at: string;
  updated_at: string;
  leave_type?: LeaveType;
}

// HR Attendance
export interface HRAttendance {
  id: number;
  employee_id: number;
  attendance_date: string;
  check_in?: string;
  check_out?: string;
  status_id: number;
  work_hours?: number;
  remarks?: string;
  created_at: string;
  updated_at: string;
  employee?: Employee;
  status?: StatusCode;
}

export interface CreateHRAttendance {
  employee_id: number;
  attendance_date: string;
  check_in?: string;
  check_out?: string;
  status_id: number;
  remarks?: string;
}

// Jobs (Recruitment)
export interface Job {
  id: number;
  title: string;
  department_id: number;
  employment_type_id: number;
  vacancies: number;
  description: string;
  requirements?: string;
  posted_date: string;
  closing_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  department?: Department;
  employment_type?: EmploymentType;
  applications?: JobApplication[];
}

export interface CreateJob {
  title: string;
  department_id: number;
  employment_type_id: number;
  vacancies: number;
  description: string;
  requirements?: string;
  posted_date: string;
  closing_date: string;
  is_active?: boolean;
}

export interface UpdateJob {
  title?: string;
  department_id?: number;
  employment_type_id?: number;
  vacancies?: number;
  description?: string;
  requirements?: string;
  closing_date?: string;
  is_active?: boolean;
}

// Job Applications
export interface JobApplication {
  id: number;
  job_id: number;
  applicant_name: string;
  email: string;
  phone: string;
  resume_path: string;
  cover_letter?: string;
  status_id: number;
  applied_date: string;
  created_at: string;
  updated_at: string;
  job?: Job;
  status?: StatusCode;
}

export interface CreateJobApplication {
  job_id: number;
  applicant_name: string;
  email: string;
  phone: string;
  resume_path: string;
  cover_letter?: string;
}

export interface UpdateJobApplicationStatus {
  status_id: number;
}

// Employee Transfer
export interface EmployeeTransfer {
  id: number;
  employee_id: number;
  from_department_id: number;
  to_department_id: number;
  transfer_date: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  employee?: Employee;
  from_department?: Department;
  to_department?: Department;
}

export interface CreateEmployeeTransfer {
  employee_id: number;
  department_id: number;
}

// Import types from other modules
interface User {
  id: number;
  username: string;
  email: string;
}

interface Department {
  id: number;
  name: string;
  code: string;
}

interface StatusCode {
  id: number;
  code: string;
  name: string;
}
