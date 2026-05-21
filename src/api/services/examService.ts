// ==================== EXAM SERVICE ====================
// Based on backend API: /api/v1/exam/*
import api from '../axios';
import type { 
  ExamComponent,
  CreateExamComponent,
  UpdateExamComponent,
  ExamApiSchedule,
  CreateExamApiSchedule,
  UpdateExamApiSchedule,
  ExamApiResult,
  CreateExamApiResult,
  BulkExamApiResult,
  UpdateExamApiResult,
  ComponentMark,
  CreateComponentMark,
  ExamRevaluation,
  CreateExamRevaluation,
  ProcessExamRevaluation,
  SupplementaryExam,
  CreateSupplementaryExam,
  StudentExamResult,
  StudentTranscript,
  StudentSGPA,
  StudentCGPA,
  ApiResponse,
  PaginatedResponse,
  QueryFilters
} from '../../types';

const EXAM_BASE = '/exam';

// Exam Components
export const examComponentService = {
  getAll: async (): Promise<ApiResponse<ExamComponent[]>> => {
    const response = await api.get<ApiResponse<ExamComponent[]>>(`${EXAM_BASE}/components`);
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<ExamComponent>> => {
    const response = await api.get<ApiResponse<ExamComponent>>(`${EXAM_BASE}/components/${id}`);
    return response.data;
  },

  create: async (data: CreateExamComponent): Promise<ApiResponse<ExamComponent>> => {
    const response = await api.post<ApiResponse<ExamComponent>>(`${EXAM_BASE}/components`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateExamComponent): Promise<ApiResponse<ExamComponent>> => {
    const response = await api.put<ApiResponse<ExamComponent>>(`${EXAM_BASE}/components/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${EXAM_BASE}/components/${id}`);
    return response.data;
  },
};

// Exam Schedules
export const examScheduleService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<ExamApiSchedule>> => {
    const response = await api.get<PaginatedResponse<ExamApiSchedule>>(`${EXAM_BASE}/schedules`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<ExamApiSchedule>> => {
    const response = await api.get<ApiResponse<ExamApiSchedule>>(`${EXAM_BASE}/schedules/${id}`);
    return response.data;
  },

  create: async (data: CreateExamApiSchedule): Promise<ApiResponse<ExamApiSchedule>> => {
    const response = await api.post<ApiResponse<ExamApiSchedule>>(`${EXAM_BASE}/schedules`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateExamApiSchedule): Promise<ApiResponse<ExamApiSchedule>> => {
    const response = await api.put<ApiResponse<ExamApiSchedule>>(`${EXAM_BASE}/schedules/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${EXAM_BASE}/schedules/${id}`);
    return response.data;
  },
};

// Exam Results
export const examResultService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<ExamApiResult>> => {
    const response = await api.get<PaginatedResponse<ExamApiResult>>(`${EXAM_BASE}/results`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<ExamApiResult>> => {
    const response = await api.get<ApiResponse<ExamApiResult>>(`${EXAM_BASE}/results/${id}`);
    return response.data;
  },

  create: async (data: CreateExamApiResult): Promise<ApiResponse<ExamApiResult>> => {
    const response = await api.post<ApiResponse<ExamApiResult>>(`${EXAM_BASE}/results`, data);
    return response.data;
  },

  bulkCreate: async (data: BulkExamApiResult[]): Promise<ApiResponse<ExamApiResult[]>> => {
    const response = await api.post<ApiResponse<ExamApiResult[]>>(`${EXAM_BASE}/results/bulk`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateExamApiResult): Promise<ApiResponse<ExamApiResult>> => {
    const response = await api.put<ApiResponse<ExamApiResult>>(`${EXAM_BASE}/results/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${EXAM_BASE}/results/${id}`);
    return response.data;
  },

  publish: async (data: { term_id: number }): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${EXAM_BASE}/results/publish`, data);
    return response.data;
  },

  // Student-specific endpoints
  getStudentResults: async (studentId: number): Promise<ApiResponse<StudentExamResult[]>> => {
    const response = await api.get<ApiResponse<StudentExamResult[]>>(`${EXAM_BASE}/students/${studentId}/results`);
    return response.data;
  },

  getMyResults: async (): Promise<ApiResponse<StudentExamResult[]>> => {
    const response = await api.get<ApiResponse<StudentExamResult[]>>(`${EXAM_BASE}/students/me/results`);
    return response.data;
  },

  getStudentTranscript: async (studentId: number): Promise<ApiResponse<StudentTranscript>> => {
    const response = await api.get<ApiResponse<StudentTranscript>>(`${EXAM_BASE}/students/${studentId}/transcript`);
    return response.data;
  },

  getMyTranscript: async (): Promise<ApiResponse<StudentTranscript>> => {
    const response = await api.get<ApiResponse<StudentTranscript>>(`${EXAM_BASE}/students/me/transcript`);
    return response.data;
  },

  getStudentSGPA: async (studentId: number): Promise<ApiResponse<StudentSGPA>> => {
    const response = await api.get<ApiResponse<StudentSGPA>>(`${EXAM_BASE}/students/${studentId}/sgpa`);
    return response.data;
  },

  getMySGPA: async (): Promise<ApiResponse<StudentSGPA>> => {
    const response = await api.get<ApiResponse<StudentSGPA>>(`${EXAM_BASE}/students/me/sgpa`);
    return response.data;
  },

  getStudentCGPA: async (studentId: number): Promise<ApiResponse<StudentCGPA>> => {
    const response = await api.get<ApiResponse<StudentCGPA>>(`${EXAM_BASE}/students/${studentId}/cgpa`);
    return response.data;
  },

  getMyCGPA: async (): Promise<ApiResponse<StudentCGPA>> => {
    const response = await api.get<ApiResponse<StudentCGPA>>(`${EXAM_BASE}/students/me/cgpa`);
    return response.data;
  },
};

// Component Marks
export const componentMarkService = {
  getResultComponentMarks: async (resultId: number): Promise<ApiResponse<ComponentMark[]>> => {
    const response = await api.get<ApiResponse<ComponentMark[]>>(`${EXAM_BASE}/results/${resultId}/component-marks`);
    return response.data;
  },

  addComponentMark: async (resultId: number, data: CreateComponentMark): Promise<ApiResponse<ComponentMark>> => {
    const response = await api.post<ApiResponse<ComponentMark>>(`${EXAM_BASE}/results/${resultId}/component-marks`, data);
    return response.data;
  },
};

// Revaluation
export const revaluationService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<ExamRevaluation>> => {
    const response = await api.get<PaginatedResponse<ExamRevaluation>>(`${EXAM_BASE}/revaluations`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<ExamRevaluation>> => {
    const response = await api.get<ApiResponse<ExamRevaluation>>(`${EXAM_BASE}/revaluations/${id}`);
    return response.data;
  },

  create: async (data: CreateExamRevaluation): Promise<ApiResponse<ExamRevaluation>> => {
    const response = await api.post<ApiResponse<ExamRevaluation>>(`${EXAM_BASE}/revaluations`, data);
    return response.data;
  },

  process: async (id: number, data: ProcessExamRevaluation): Promise<ApiResponse<ExamRevaluation>> => {
    const response = await api.post<ApiResponse<ExamRevaluation>>(`${EXAM_BASE}/revaluations/${id}/process`, data);
    return response.data;
  },
};

// Supplementary Exams
export const supplementaryExamService = {
  getAll: async (filters?: QueryFilters): Promise<PaginatedResponse<SupplementaryExam>> => {
    const response = await api.get<PaginatedResponse<SupplementaryExam>>(`${EXAM_BASE}/supplementary`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<SupplementaryExam>> => {
    const response = await api.get<ApiResponse<SupplementaryExam>>(`${EXAM_BASE}/supplementary/${id}`);
    return response.data;
  },

  create: async (data: CreateSupplementaryExam): Promise<ApiResponse<SupplementaryExam>> => {
    const response = await api.post<ApiResponse<SupplementaryExam>>(`${EXAM_BASE}/supplementary`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${EXAM_BASE}/supplementary/${id}`);
    return response.data;
  },
};

// Default export as object
export default { 
  components: examComponentService,
  schedules: examScheduleService,
  results: examResultService,
  componentMarks: componentMarkService,
  revaluations: revaluationService,
  supplementary: supplementaryExamService,
};
