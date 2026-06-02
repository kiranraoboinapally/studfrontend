// ==================== ACADEMIC SERVICE ====================
import api from '../axios';
import type { 
  ApiResponse,
  QueryFilters 
} from '../../types';

const ACADEMIC_BASE = '/api/v1/academic';

export const academicService = {
  // Academic Terms (replacing academic-years)
  getTerms: async (filters?: QueryFilters): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`${ACADEMIC_BASE}/terms`, { params: filters });
    return response.data;
  },

  getCurrentTerm: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>(`${ACADEMIC_BASE}/terms/current`);
    return response.data;
  },

  createTerm: async (data: { name: string; academic_year: string; start_date: string; end_date: string; is_current?: boolean }): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(`${ACADEMIC_BASE}/terms`, data);
    return response.data;
  },

  updateTerm: async (id: number, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put<ApiResponse<any>>(`${ACADEMIC_BASE}/terms/${id}`, data);
    return response.data;
  },

  setCurrentTerm: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${ACADEMIC_BASE}/terms/${id}/set-current`);
    return response.data;
  },

  // Programs
  getPrograms: async (filters?: QueryFilters): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`${ACADEMIC_BASE}/programs`, { params: filters });
    return response.data;
  },

  createProgram: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(`${ACADEMIC_BASE}/programs`, data);
    return response.data;
  },

  // Subjects
  getSubjects: async (filters?: QueryFilters): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`${ACADEMIC_BASE}/subjects`, { params: filters });
    return response.data;
  },

  createSubject: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(`${ACADEMIC_BASE}/subjects`, data);
    return response.data;
  },

  // Batches
  getBatches: async (filters?: QueryFilters): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`${ACADEMIC_BASE}/batches`, { params: filters });
    return response.data;
  },

  createBatch: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(`${ACADEMIC_BASE}/batches`, data);
    return response.data;
  },

  // Course Offerings
  getOfferings: async (filters?: QueryFilters): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`${ACADEMIC_BASE}/offerings`, { params: filters });
    return response.data;
  },

  createOffering: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(`${ACADEMIC_BASE}/offerings`, data);
    return response.data;
  },

  // Term Registrations
  getTermRegistrations: async (filters?: QueryFilters): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`${ACADEMIC_BASE}/term-registrations`, { params: filters });
    return response.data;
  },

  registerTerm: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(`${ACADEMIC_BASE}/term-registrations`, data);
    return response.data;
  },

  // Course Registrations
  registerCourse: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(`${ACADEMIC_BASE}/course-registrations`, data);
    return response.data;
  },

  dropCourse: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${ACADEMIC_BASE}/course-registrations/${id}/drop`);
    return response.data;
  },

  // Student Courses
  getStudentCourses: async (studentId: number): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`${ACADEMIC_BASE}/students/${studentId}/courses`);
    return response.data;
  },

  // Student Timetable
  getStudentTimetable: async (studentId: number): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`${ACADEMIC_BASE}/students/${studentId}/timetable`);
    return response.data;
  },

  // Attendance
  markAttendance: async (data: any): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${ACADEMIC_BASE}/attendance`, data);
    return response.data;
  },

  getStudentAttendance: async (studentId: number): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`${ACADEMIC_BASE}/students/${studentId}/attendance`);
    return response.data;
  },

  getAttendanceSummary: async (studentId: number): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>(`${ACADEMIC_BASE}/students/${studentId}/attendance/summary`);
    return response.data;
  },
};

export default academicService;
