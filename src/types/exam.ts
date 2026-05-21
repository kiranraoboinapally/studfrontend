// ==================== EXAM MODULE TYPES ====================
// Based on backend API: /api/v1/exam/*

// Exam Components
export interface ExamComponent {
  id: number;
  name: string;
  max_marks: number;
  weightage_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateExamComponent {
  name: string;
  max_marks: number;
  weightage_percentage: number;
}

export interface UpdateExamComponent {
  name?: string;
  max_marks?: number;
  weightage_percentage?: number;
  is_active?: boolean;
}

// Exam Schedules (Backend API Module)
export interface ExamApiSchedule {
  id: number;
  term_id: number;
  subject_id: number;
  exam_type: 'mid_sem' | 'end_sem' | 'supplementary' | 'special';
  start_date: string;
  end_date: string;
  room_id: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  term?: AcademicTerm;
  subject?: Subject;
  room?: Room;
}

export interface CreateExamApiSchedule {
  term_id: number;
  subject_id: number;
  exam_type: 'mid_sem' | 'end_sem' | 'supplementary' | 'special';
  start_date: string;
  end_date: string;
  room_id: number;
}

export interface UpdateExamApiSchedule {
  term_id?: number;
  subject_id?: number;
  exam_type?: 'mid_sem' | 'end_sem' | 'supplementary' | 'special';
  start_date?: string;
  end_date?: string;
  room_id?: number;
  is_published?: boolean;
}

// Exam Results (Backend API Module)
export interface ExamApiResult {
  id: number;
  student_id: number;
  subject_id: number;
  schedule_id: number;
  marks_obtained: number;
  total_marks: number;
  grade: string;
  grade_point: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  student?: Student;
  subject?: Subject;
  schedule?: ExamApiSchedule;
  component_marks?: ComponentMark[];
}

export interface CreateExamApiResult {
  student_id: number;
  subject_id: number;
  schedule_id: number;
  marks_obtained: number;
  total_marks: number;
  grade: string;
  grade_point: number;
}

export interface BulkExamApiResult {
  student_id: number;
  subject_id: number;
  schedule_id: number;
  marks_obtained: number;
  total_marks: number;
  grade: string;
  grade_point: number;
}

export interface UpdateExamApiResult {
  marks_obtained?: number;
  total_marks?: number;
  grade?: string;
  grade_point?: number;
  is_published?: boolean;
}

// Component Marks
export interface ComponentMark {
  id: number;
  result_id: number;
  component_id: number;
  marks_obtained: number;
  max_marks: number;
  created_at: string;
  updated_at: string;
  component?: ExamComponent;
}

export interface CreateComponentMark {
  component_id: number;
  marks_obtained: number;
  max_marks: number;
}

// Revaluation (Backend API Module)
export interface ExamRevaluation {
  id: number;
  result_id: number;
  student_id: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  reviewed_marks?: number;
  reviewed_grade?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
  result?: ExamApiResult;
  student?: Student;
}

export interface CreateExamRevaluation {
  result_id: number;
  student_id: number;
  reason: string;
}

export interface ProcessExamRevaluation {
  reviewed_marks: number;
  grade: string;
  remarks: string;
}

// Supplementary Exam
export interface SupplementaryExam {
  id: number;
  term_id: number;
  subject_id: number;
  exam_date: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  term?: AcademicTerm;
  subject?: Subject;
}

export interface CreateSupplementaryExam {
  term_id: number;
  subject_id: number;
  exam_date: string;
}

// Student Exam Data
export interface StudentExamResult {
  id: number;
  subject_id: number;
  subject_name: string;
  subject_code: string;
  marks_obtained: number;
  total_marks: number;
  grade: string;
  grade_point: number;
  semester: number;
  academic_year: string;
}

export interface StudentTranscript {
  student_id: number;
  student_name: string;
  university_reg_no: string;
  program: string;
  academic_year: string;
  cgpa: number;
  sgpa_by_semester: {
    semester: number;
    sgpa: number;
    academic_year: string;
  }[];
  results: StudentExamResult[];
}

export interface StudentSGPA {
  student_id: number;
  semester: number;
  academic_year: string;
  sgpa: number;
  total_credits: number;
  total_grade_points: number;
}

export interface StudentCGPA {
  student_id: number;
  cgpa: number;
  total_credits_earned: number;
  total_grade_points: number;
  current_semester: number;
}

// Import types from other modules
interface AcademicTerm {
  id: number;
  name: string;
  term_number: number;
  academic_year: string;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  credits: number;
}

interface Room {
  id: number;
  room_number: string;
  room_type: string;
  capacity: number;
}

interface Student {
  id: number;
  university_reg_no: string;
  first_name: string;
  last_name: string;
}
