import api from "../axios";
import {
  EnquiryForm,
  OTPVerification,
  StudentDashboard,
  AdmissionApplication,
  ApplicationStage,
  TimelineEvent,
  PaymentRecord,
  StudentProfile,
  UniversityAdmin,
  CreateUserForm,
  QualificationFlow,
  ApiResponse,
  ScholarshipApplication,
  UploadedDocuments,
} from "../../types/admissionPortal";

// ==================== ENQUIRY & LEAD REGISTRATION ====================

export const submitEnquiry = async (data: EnquiryForm): Promise<ApiResponse<{ enquiry_id: number }>> => {
  const response = await api.post("/api/v1/admissions/enquiry", data);
  return response.data;
};

export const getQualificationFlow = async (qualificationType: string): Promise<ApiResponse<QualificationFlow>> => {
  const response = await api.get(`/api/v1/admissions/qualification-flow/${qualificationType}`);
  return response.data;
};

export const getEnquiryStatus = async (enquiryId: number): Promise<ApiResponse<any>> => {
  const response = await api.get(`/api/v1/admissions/enquiry/${enquiryId}`);
  return response.data;
};

// ==================== OTP VERIFICATION ====================

export const sendOTP = async (mobile: string, email: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await api.post("/api/v1/auth/send-otp", { mobile, email });
  return response.data;
};

export const verifyOTP = async (data: OTPVerification): Promise<ApiResponse<{ token: string; user_id: number }>> => {
  const response = await api.post("/api/v1/auth/verify-otp", data);
  return response.data;
};

export const resendOTP = async (type: 'mobile' | 'email'): Promise<ApiResponse<{ message: string }>> => {
  const response = await api.post("/api/v1/auth/resend-otp", { type });
  return response.data;
};

// ==================== STUDENT PORTAL DASHBOARD ====================

export const getStudentDashboard = async (): Promise<ApiResponse<StudentDashboard>> => {
  const response = await api.get("/api/v1/admissions/student/dashboard");
  return response.data;
};

// ==================== ADMISSION APPLICATION ====================

export const createApplication = async (data: Partial<AdmissionApplication>): Promise<ApiResponse<{ application_id: number }>> => {
  const response = await api.post("/api/v1/admissions/applications", data);
  return response.data;
};

export const updateApplication = async (applicationId: number, data: Partial<AdmissionApplication>): Promise<ApiResponse<any>> => {
  const response = await api.put(`/api/v1/admissions/applications/${applicationId}`, data);
  return response.data;
};

export const getApplication = async (applicationId: number): Promise<ApiResponse<AdmissionApplication>> => {
  const response = await api.get(`/api/v1/admissions/applications/${applicationId}`);
  return response.data;
};

export const getMyApplications = async (): Promise<ApiResponse<AdmissionApplication[]>> => {
  const response = await api.get("/api/v1/admissions/my-applications");
  return response.data;
};

export const saveDraft = async (applicationId: number, data: Partial<AdmissionApplication>): Promise<ApiResponse<any>> => {
  const response = await api.put(`/api/v1/admissions/applications/${applicationId}/draft`, data);
  return response.data;
};

export const submitApplication = async (applicationId: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await api.post(`/api/v1/admissions/applications/${applicationId}/submit`);
  return response.data;
};

// ==================== APPLICATION PAYMENT ====================

export const initiatePayment = async (applicationId: number, paymentMethod: string): Promise<ApiResponse<{ payment_url: string; transaction_id: string }>> => {
  const response = await api.post("/api/v1/payments/initiate", {
    application_id: applicationId,
    payment_method: paymentMethod,
  });
  return response.data;
};

export const verifyPayment = async (transactionId: string): Promise<ApiResponse<{ status: string; receipt_url: string }>> => {
  const response = await api.post("/api/v1/payments/verify", { transaction_id: transactionId });
  return response.data;
};

export const getPaymentReceipt = async (transactionId: string): Promise<ApiResponse<any>> => {
  const response = await api.get(`/api/v1/payments/receipt/${transactionId}`);
  return response.data;
};

// ==================== DOCUMENT UPLOAD ====================

export const uploadDocument = async (applicationId: number, documentType: string, file: File): Promise<ApiResponse<{ file_url: string }>> => {
  const formData = new FormData();
  formData.append('document_type', documentType);
  formData.append('file', file);
  
  const response = await api.post(`/api/v1/admissions/applications/${applicationId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteDocument = async (documentId: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await api.delete(`/api/v1/admissions/documents/${documentId}`);
  return response.data;
};

export const getDocuments = async (applicationId: number): Promise<ApiResponse<UploadedDocuments>> => {
  const response = await api.get(`/api/v1/admissions/applications/${applicationId}/documents`);
  return response.data;
};

// ==================== SCHOLARSHIP APPLICATION ====================

export const submitScholarshipApplication = async (applicationId: number, data: ScholarshipApplication): Promise<ApiResponse<{ scholarship_id: number }>> => {
  const response = await api.post(`/api/v1/admissions/applications/${applicationId}/scholarship`, data);
  return response.data;
};

export const getScholarshipEligibility = async (applicationId: number): Promise<ApiResponse<any>> => {
  const response = await api.get(`/api/v1/admissions/applications/${applicationId}/scholarship-eligibility`);
  return response.data;
};

export const getScholarshipStatus = async (applicationId: number): Promise<ApiResponse<any>> => {
  const response = await api.get(`/api/v1/admissions/applications/${applicationId}/scholarship-status`);
  return response.data;
};

// ==================== APPLICATION TRACKING ====================

export const getApplicationTimeline = async (applicationId: number): Promise<ApiResponse<TimelineEvent[]>> => {
  const response = await api.get(`/api/v1/admissions/applications/${applicationId}/timeline`);
  return response.data;
};

export const updateApplicationStatus = async (applicationId: number, status: ApplicationStage): Promise<ApiResponse<any>> => {
  const response = await api.put(`/api/v1/admissions/applications/${applicationId}/status`, { status });
  return response.data;
};

// ==================== PAYMENT HISTORY ====================

export const getPaymentHistory = async (applicationId?: number): Promise<ApiResponse<PaymentRecord[]>> => {
  const url = applicationId 
    ? `/api/v1/payments/history?application_id=${applicationId}`
    : "/api/v1/payments/history";
  const response = await api.get(url);
  return response.data;
};

// ==================== PROFILE ====================

export const getStudentProfile = async (): Promise<ApiResponse<StudentProfile>> => {
  const response = await api.get("/api/v1/admissions/student/profile");
  return response.data;
};

export const updateStudentProfile = async (data: Partial<StudentProfile>): Promise<ApiResponse<any>> => {
  const response = await api.put("/api/v1/admissions/student/profile", data);
  return response.data;
};

// ==================== UNIVERSITY ADMIN USER MANAGEMENT ====================

export const getUsers = async (role?: string): Promise<ApiResponse<UniversityAdmin[]>> => {
  const url = role ? `/api/v1/admin/users?role=${role}` : "/api/v1/admin/users";
  const response = await api.get(url);
  return response.data;
};

export const createUser = async (data: CreateUserForm): Promise<ApiResponse<{ user_id: number }>> => {
  const response = await api.post("/api/v1/admin/users", data);
  return response.data;
};

export const updateUser = async (userId: number, data: Partial<CreateUserForm>): Promise<ApiResponse<any>> => {
  const response = await api.put(`/api/v1/admin/users/${userId}`, data);
  return response.data;
};

export const deleteUser = async (userId: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await api.delete(`/api/v1/admin/users/${userId}`);
  return response.data;
};

export const toggleUserStatus = async (userId: number, status: 'active' | 'inactive'): Promise<ApiResponse<any>> => {
  const response = await api.put(`/api/v1/admin/users/${userId}/status`, { status });
  return response.data;
};

// ==================== LOOKUP DATA ====================
// Using existing backend endpoints

export const getCountries = async (): Promise<ApiResponse<any[]>> => {
  // Backend doesn't have countries endpoint - return empty array
  // Form will need to handle this or backend needs to add this endpoint
  return {
    success: true,
    data: [],
  };
};

export const getStates = async (countryId?: string): Promise<ApiResponse<any[]>> => {
  // Backend doesn't have states endpoint - return empty array
  return {
    success: true,
    data: [],
  };
};

export const getDistricts = async (stateId?: string): Promise<ApiResponse<any[]>> => {
  // Backend doesn't have districts endpoint - return empty array
  return {
    success: true,
    data: [],
  };
};

export const getCampuses = async (): Promise<ApiResponse<any[]>> => {
  // Use existing campuses endpoint from backend
  const response = await api.get("/api/v1/universities");
  console.log("Campuses response:", response.data);
  const data = response.data.data || response.data;
  return {
    success: true,
    data: Array.isArray(data) ? data : [],
  };
};

export const getPrograms = async (): Promise<ApiResponse<any[]>> => {
  try {
    // Use existing programs endpoint from backend
    const response = await api.get("/api/v1/academic/programs");
    const data = response.data.data || response.data;
    return {
      success: true,
      data: Array.isArray(data) ? data : [],
    };
  } catch (error: any) {
    // If 401, programs endpoint requires authentication
    if (error.response?.status === 401) {
      console.warn("Programs endpoint requires authentication");
      return {
        success: true,
        data: [],
      };
    }
    throw error;
  }
};

export const getAdmissionCycles = async (): Promise<ApiResponse<any[]>> => {
  // Use existing admission cycles endpoint
  const response = await api.get("/api/v1/admissions/cycles/open");
  return response.data;
};

export const getDegreeTypes = async (): Promise<ApiResponse<string[]>> => {
  try {
    // Fetch programs and extract unique degree_types
    const response = await api.get("/api/v1/academic/programs");
    const programs = response.data.data || response.data;
    
    // Extract unique degree_types
    const degreeTypes = Array.isArray(programs) 
      ? [...new Set(programs.map((p: any) => p.degree_type).filter(Boolean))]
      : [];
    
    return {
      success: true,
      data: degreeTypes,
    };
  } catch (error: any) {
    // If 401, programs endpoint requires authentication
    if (error.response?.status === 401) {
      console.warn("Programs endpoint requires authentication");
      return {
        success: true,
        data: [],
      };
    }
    throw error;
  }
};

export const getProgramsByDegreeType = async (degreeType: string): Promise<ApiResponse<any[]>> => {
  try {
    // Fetch all programs and filter by degree_type
    const response = await api.get("/api/v1/academic/programs");
    const programs = response.data.data || response.data;
    
    // Filter programs by degree_type
    const filteredPrograms = Array.isArray(programs) 
      ? programs.filter((p: any) => p.degree_type === degreeType)
      : [];
    
    return {
      success: true,
      data: filteredPrograms,
    };
  } catch (error: any) {
    // If 401, programs endpoint requires authentication
    if (error.response?.status === 401) {
      console.warn("Programs endpoint requires authentication");
      return {
        success: true,
        data: [],
      };
    }
    throw error;
  }
};
