// ==================== HR SERVICE ====================
// Based on backend API: /api/v1/hr/*
import api from '../axios';
import type { 
  HRStats,
  Designation,
  CreateDesignation,
  UpdateDesignation,
  EmploymentType,
  LeaveType,
  CreateLeaveType,
  UpdateLeaveType,
  SalaryComponent,
  CreateSalaryComponent,
  UpdateSalaryComponent,
  Employee,
  CreateEmployee,
  UpdateEmployee,
  FacultyProfile,
  CreateFacultyProfile,
  UpdateFacultyProfile,
  EmployeeSalary,
  CreateEmployeeSalary,
  UpdateEmployeeSalary,
  PayrollRun,
  LeaveRequest,
  CreateLeaveRequest,
  UpdateLeaveRequest,
  LeaveBalance,
  HRAttendance,
  CreateHRAttendance,
  Job,
  CreateJob,
  UpdateJob,
  JobApplication,
  CreateJobApplication,
  UpdateJobApplicationStatus,
  EmployeeTransfer,
  CreateEmployeeTransfer,
  ApiResponse,
  PaginatedResponse,
  QueryFilters
} from '../../types';

const HR_BASE = '/hr';

// HR Statistics
export const hrStatsService = {
  getStats: async (): Promise<ApiResponse<HRStats>> => {
    const response = await api.get<ApiResponse<HRStats>>(`${HR_BASE}/stats`);
    return response.data;
  },
};

// Designations
export const designationService = {
  getAll: async (): Promise<ApiResponse<Designation[]>> => {
    const response = await api.get<ApiResponse<Designation[]>>(`${HR_BASE}/designations`);
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Designation>> => {
    const response = await api.get<ApiResponse<Designation>>(`${HR_BASE}/designations/${id}`);
    return response.data;
  },

  create: async (data: CreateDesignation): Promise<ApiResponse<Designation>> => {
    const response = await api.post<ApiResponse<Designation>>(`${HR_BASE}/designations`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateDesignation): Promise<ApiResponse<Designation>> => {
    const response = await api.put<ApiResponse<Designation>>(`${HR_BASE}/designations/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${HR_BASE}/designations/${id}`);
    return response.data;
  },
};

// Employment Types
export const employmentTypeService = {
  getAll: async (): Promise<ApiResponse<EmploymentType[]>> => {
    const response = await api.get<ApiResponse<EmploymentType[]>>(`${HR_BASE}/employment-types`);
    return response.data;
  },
};

// Leave Types
export const leaveTypeService = {
  getAll: async (): Promise<ApiResponse<LeaveType[]>> => {
    const response = await api.get<ApiResponse<LeaveType[]>>(`${HR_BASE}/leave-types`);
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<LeaveType>> => {
    const response = await api.get<ApiResponse<LeaveType>>(`${HR_BASE}/leave-types/${id}`);
    return response.data;
  },

  create: async (data: CreateLeaveType): Promise<ApiResponse<LeaveType>> => {
    const response = await api.post<ApiResponse<LeaveType>>(`${HR_BASE}/leave-types`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateLeaveType): Promise<ApiResponse<LeaveType>> => {
    const response = await api.put<ApiResponse<LeaveType>>(`${HR_BASE}/leave-types/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${HR_BASE}/leave-types/${id}`);
    return response.data;
  },
};

// Salary Components
export const salaryComponentService = {
  getAll: async (): Promise<ApiResponse<SalaryComponent[]>> => {
    const response = await api.get<ApiResponse<SalaryComponent[]>>(`${HR_BASE}/salary-components`);
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<SalaryComponent>> => {
    const response = await api.get<ApiResponse<SalaryComponent>>(`${HR_BASE}/salary-components/${id}`);
    return response.data;
  },

  create: async (data: CreateSalaryComponent): Promise<ApiResponse<SalaryComponent>> => {
    const response = await api.post<ApiResponse<SalaryComponent>>(`${HR_BASE}/salary-components`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateSalaryComponent): Promise<ApiResponse<SalaryComponent>> => {
    const response = await api.put<ApiResponse<SalaryComponent>>(`${HR_BASE}/salary-components/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${HR_BASE}/salary-components/${id}`);
    return response.data;
  },
};

// Employees
export const employeeService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<Employee>> => {
    const response = await api.get<PaginatedResponse<Employee>>(`${HR_BASE}/employees`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Employee>> => {
    const response = await api.get<ApiResponse<Employee>>(`${HR_BASE}/employees/${id}`);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<Employee>> => {
    const response = await api.get<ApiResponse<Employee>>(`${HR_BASE}/employees/me`);
    return response.data;
  },

  create: async (data: CreateEmployee): Promise<ApiResponse<Employee>> => {
    const response = await api.post<ApiResponse<Employee>>(`${HR_BASE}/employees`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateEmployee): Promise<ApiResponse<Employee>> => {
    const response = await api.put<ApiResponse<Employee>>(`${HR_BASE}/employees/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${HR_BASE}/employees/${id}`);
    return response.data;
  },

  deactivate: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${HR_BASE}/employees/${id}/deactivate`);
    return response.data;
  },

  transfer: async (id: number, data: CreateEmployeeTransfer): Promise<ApiResponse<EmployeeTransfer>> => {
    const response = await api.post<ApiResponse<EmployeeTransfer>>(`${HR_BASE}/employees/${id}/transfer`, data);
    return response.data;
  },
};

// Faculty Profile
export const facultyProfileService = {
  updateProfile: async (employeeId: number, data: CreateFacultyProfile): Promise<ApiResponse<FacultyProfile>> => {
    const response = await api.put<ApiResponse<FacultyProfile>>(`${HR_BASE}/employees/${employeeId}/faculty-profile`, data);
    return response.data;
  },

  getProfile: async (employeeId: number): Promise<ApiResponse<FacultyProfile>> => {
    const response = await api.get<ApiResponse<FacultyProfile>>(`${HR_BASE}/employees/${employeeId}/faculty-profile`);
    return response.data;
  },

  getAllFaculty: async (): Promise<ApiResponse<Employee[]>> => {
    const response = await api.get<ApiResponse<Employee[]>>(`${HR_BASE}/faculty`);
    return response.data;
  },
};

// Employee Salary
export const employeeSalaryService = {
  assignSalary: async (employeeId: number, data: CreateEmployeeSalary): Promise<ApiResponse<EmployeeSalary>> => {
    const response = await api.post<ApiResponse<EmployeeSalary>>(`${HR_BASE}/employees/${employeeId}/salary`, data);
    return response.data;
  },

  updateSalary: async (employeeId: number, data: UpdateEmployeeSalary): Promise<ApiResponse<EmployeeSalary>> => {
    const response = await api.put<ApiResponse<EmployeeSalary>>(`${HR_BASE}/employees/${employeeId}/salary`, data);
    return response.data;
  },
};

// Payroll
export const payrollService = {
  runPayroll: async (data: { employee_id: number; month: string }): Promise<ApiResponse<PayrollRun>> => {
    const response = await api.post<ApiResponse<PayrollRun>>(`${HR_BASE}/payroll/run`, data);
    return response.data;
  },

  getPayrollHistory: async (employeeId?: number): Promise<ApiResponse<PayrollRun[]>> => {
    const params = employeeId ? { employee_id: employeeId } : {};
    const response = await api.get<ApiResponse<PayrollRun[]>>(`${HR_BASE}/payroll`, { params });
    return response.data;
  },
};

// Leave Requests
export const leaveRequestService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<LeaveRequest>> => {
    const response = await api.get<PaginatedResponse<LeaveRequest>>(`${HR_BASE}/leave-requests`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<LeaveRequest>> => {
    const response = await api.get<ApiResponse<LeaveRequest>>(`${HR_BASE}/leave-requests/${id}`);
    return response.data;
  },

  create: async (data: CreateLeaveRequest): Promise<ApiResponse<LeaveRequest>> => {
    const response = await api.post<ApiResponse<LeaveRequest>>(`${HR_BASE}/leave-requests`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateLeaveRequest): Promise<ApiResponse<LeaveRequest>> => {
    const response = await api.put<ApiResponse<LeaveRequest>>(`${HR_BASE}/leave-requests/${id}`, data);
    return response.data;
  },

  approve: async (id: number): Promise<ApiResponse<LeaveRequest>> => {
    const response = await api.post<ApiResponse<LeaveRequest>>(`${HR_BASE}/leave-requests/${id}/approve`);
    return response.data;
  },

  reject: async (id: number): Promise<ApiResponse<LeaveRequest>> => {
    const response = await api.post<ApiResponse<LeaveRequest>>(`${HR_BASE}/leave-requests/${id}/reject`);
    return response.data;
  },
};

// Leave Balances
export const leaveBalanceService = {
  getEmployeeBalances: async (employeeId: number): Promise<ApiResponse<LeaveBalance[]>> => {
    const response = await api.get<ApiResponse<LeaveBalance[]>>(`${HR_BASE}/employees/${employeeId}/leave-balances`);
    return response.data;
  },
};

// HR Attendance
export const hrAttendanceService = {
  markAttendance: async (data: CreateHRAttendance): Promise<ApiResponse<HRAttendance>> => {
    const response = await api.post<ApiResponse<HRAttendance>>(`${HR_BASE}/attendance`, data);
    return response.data;
  },

  getEmployeeAttendance: async (employeeId: number): Promise<ApiResponse<HRAttendance[]>> => {
    const response = await api.get<ApiResponse<HRAttendance[]>>(`${HR_BASE}/employees/${employeeId}/attendance`);
    return response.data;
  },
};

// Jobs (Recruitment)
export const jobService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<Job>> => {
    const response = await api.get<PaginatedResponse<Job>>(`${HR_BASE}/jobs`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Job>> => {
    const response = await api.get<ApiResponse<Job>>(`${HR_BASE}/jobs/${id}`);
    return response.data;
  },

  create: async (data: CreateJob): Promise<ApiResponse<Job>> => {
    const response = await api.post<ApiResponse<Job>>(`${HR_BASE}/jobs`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateJob): Promise<ApiResponse<Job>> => {
    const response = await api.put<ApiResponse<Job>>(`${HR_BASE}/jobs/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${HR_BASE}/jobs/${id}`);
    return response.data;
  },
};

// Job Applications
export const jobApplicationService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<JobApplication>> => {
    const response = await api.get<PaginatedResponse<JobApplication>>(`${HR_BASE}/job-applications`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<JobApplication>> => {
    const response = await api.get<ApiResponse<JobApplication>>(`${HR_BASE}/job-applications/${id}`);
    return response.data;
  },

  apply: async (jobId: number, data: CreateJobApplication): Promise<ApiResponse<JobApplication>> => {
    const response = await api.post<ApiResponse<JobApplication>>(`${HR_BASE}/jobs/${jobId}/applications`, data);
    return response.data;
  },

  updateStatus: async (id: number, data: UpdateJobApplicationStatus): Promise<ApiResponse<JobApplication>> => {
    const response = await api.put<ApiResponse<JobApplication>>(`${HR_BASE}/job-applications/${id}/status`, data);
    return response.data;
  },
};

// Default export as object
export default { 
  stats: hrStatsService,
  designations: designationService,
  employmentTypes: employmentTypeService,
  leaveTypes: leaveTypeService,
  salaryComponents: salaryComponentService,
  employees: employeeService,
  facultyProfiles: facultyProfileService,
  salaries: employeeSalaryService,
  payroll: payrollService,
  leaveRequests: leaveRequestService,
  leaveBalances: leaveBalanceService,
  attendance: hrAttendanceService,
  jobs: jobService,
  jobApplications: jobApplicationService,
};
