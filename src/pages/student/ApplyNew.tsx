import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { admissionCycleService, applicantService, applicantDocumentService } from "../../api/services/admissionService";
import { programService } from "../../api/services/coreService";
import api from "../../api/axios";
import type { 
  AdmissionApiCycle, 
  CreateAdmissionApiApplicant,
  Program,
  Lookup,
  CreateApplicantDocument
} from "../../types";
import {
  GraduationCap, Send, CheckCircle, Upload, Home, Bus,
  User, BookOpen, Layers, FileText, XCircle, Clock,
  Calendar, Phone, Mail, Award, AlertCircle, ChevronRight,
  ShieldCheck, FileCheck, ArrowRight, RefreshCw, CreditCard,
  IndianRupee, Building2, MapPin, Users
} from "lucide-react";

interface ApplyForm {
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
  // New fields
  hostel_required: boolean;
  hostel_type?: 'ac' | 'non_ac';
  transport_required: boolean;
  scholarship_status: 'none' | 'state_topper' | 'state_player';
  stream_id?: number;
}

const STEPS = [
  { label: "Select Admission", icon: Calendar, color: "from-purple-500 to-purple-600" },
  { label: "Personal Info", icon: User, color: "from-blue-500 to-blue-600" },
  { label: "Academic Info", icon: BookOpen, color: "from-green-500 to-green-600" },
  { label: "Hostel & Transport", icon: Home, color: "from-orange-500 to-orange-600" },
  { label: "Documents", icon: FileText, color: "from-pink-500 to-pink-600" },
  { label: "Review & Submit", icon: FileCheck, color: "from-primary-600 to-primary-700" },
];

export default function ApplyNew() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [cycles, setCycles] = useState<AdmissionApiCycle[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [genders, setGenders] = useState<Lookup[]>([]);
  const [categories, setCategories] = useState<Lookup[]>([]);
  const [streams, setStreams] = useState<Lookup[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<AdmissionApiCycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicantId, setApplicantId] = useState<number | null>(null);
  const [enrollmentNumber, setEnrollmentNumber] = useState<string | null>(null);
  const [seatAvailability, setSeatAvailability] = useState<{ available: boolean; total_seats: number; allocated_seats: number; available_seats: number } | null>(null);
  
  // Document upload states
  const [uploadedDocuments, setUploadedDocuments] = useState<CreateApplicantDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ApplyForm>();

  const hostelRequired = watch("hostel_required");
  const selectedProgramId = watch("program_id");

  // Check seat availability when program is selected
  useEffect(() => {
    const checkAvailability = async () => {
      if (selectedCycle && selectedProgramId) {
        try {
          const response = await applicantService.checkSeatAvailability(
            Number(selectedCycle),
            Number(selectedProgramId)
          );
          setSeatAvailability(response.data);
        } catch (err) {
          console.error("Failed to check seat availability:", err);
          setSeatAvailability(null);
        }
      } else {
        setSeatAvailability(null);
      }
    };

    checkAvailability();
  }, [selectedCycle, selectedProgramId]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load cycles and programs
        let cyclesData: AdmissionApiCycle[] = [];
        let programsData: Program[] = [];
        
        try {
          const cyclesRes = await admissionCycleService.getOpenCycles();
          cyclesData = cyclesRes.data || [];
        } catch (err) {
          console.log("Cycles endpoint not available, using mock data");
          cyclesData = [
            { id: 1, name: "2026-27 Admissions", academic_year: "2026-27", start_date: "2026-01-01", end_date: "2026-12-31", is_open: true } as AdmissionApiCycle,
          ];
        }
        
        try {
          const programsRes = await programService.getAll();
          programsData = programsRes.data || [];
        } catch (err) {
          console.log("Programs endpoint not available, using mock data");
          programsData = [
            { id: 1, name: "B.Tech Computer Science", code: "BTCS", degree_type: "Bachelor", duration_years: 4 } as Program,
            { id: 2, name: "B.Tech Electronics", code: "BTEC", degree_type: "Bachelor", duration_years: 4 } as Program,
          ];
        }

        setCycles(cyclesData);
        setPrograms(programsData);
        
        // Load genders, categories, and streams from backend
        try {
          const [gendersRes, categoriesRes] = await Promise.all([
            api.get("/lookups/genders"),
            api.get("/lookups/categories"),
          ]);
          setGenders(gendersRes.data.data || []);
          setCategories(categoriesRes.data.data || []);
        } catch (err) {
          console.log("Lookups not available, using defaults");
          // Set default values if lookup endpoints don't exist
          setGenders([
            { id: 1, name: "Male", code: "male" },
            { id: 2, name: "Female", code: "female" },
            { id: 3, name: "Other", code: "other" },
          ]);
          setCategories([
            { id: 1, name: "General", code: "general" },
            { id: 2, name: "OBC", code: "obc" },
            { id: 3, name: "SC", code: "sc" },
            { id: 4, name: "ST", code: "st" },
          ]);
        }
        
        // Load streams (if available)
        try {
          const streamsRes = await api.get("/lookups/streams");
          setStreams(streamsRes.data.data || []);
        } catch (err) {
          console.log("Streams not available");
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        toast.error("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stepFields: (keyof ApplyForm)[][] = [
    ["cycle_id", "program_id"],
    ["first_name", "last_name", "email", "phone", "date_of_birth", "gender_id", "category_id", "address"],
    ["previous_qualification", "previous_percentage", "scholarship_status", "stream_id"],
    ["hostel_required", "hostel_type", "transport_required"],
    [], // Documents handled separately
    [],
  ];

  const nextStep = async () => {
    const valid = await trigger(stepFields[step]);
    if (!valid) return;
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setStep((s) => s - 1);
  };

  const handleFileUpload = async (documentType: string, file: File) => {
    setUploading(true);
    try {
      // In a real implementation, you would upload the file to a server
      // For now, we'll simulate the upload
      const filePath = `/uploads/${documentType}_${Date.now()}_${file.name}`;
      
      const doc: CreateApplicantDocument = {
        document_type: documentType,
        file_path: filePath,
        verified: false,
      };

      setUploadedDocuments([...uploadedDocuments, doc]);
      setSelectedFiles({ ...selectedFiles, [documentType]: file });
      toast.success(`${documentType} uploaded successfully`);
    } catch (err) {
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ApplyForm) => {
    if (!selectedCycle) {
      toast.error("Please select an admission cycle");
      return;
    }

    // Check seat availability before submission
    if (seatAvailability && !seatAvailability.available) {
      toast.error("Sorry, seats are full for this program. Please choose another program or contact admissions office.");
      return;
    }

    setSubmitting(true);
    try {
      // Create applicant
      const applicantData: CreateAdmissionApiApplicant = {
        cycle_id: Number(data.cycle_id),
        program_id: Number(data.program_id),
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        gender_id: Number(data.gender_id),
        category_id: Number(data.category_id),
        address: data.address,
        previous_qualification: data.previous_qualification,
        previous_percentage: Number(data.previous_percentage),
        hostel_required: data.hostel_required,
        hostel_type: data.hostel_type,
        transport_required: data.transport_required,
        scholarship_status: data.scholarship_status,
        stream_id: data.stream_id ? Number(data.stream_id) : undefined,
      };

      const applicantRes = await applicantService.create(applicantData);
      const newApplicantId = applicantRes.data.id;
      setApplicantId(newApplicantId);

      // Upload documents
      for (const doc of uploadedDocuments) {
        await applicantDocumentService.uploadDocument(newApplicantId, doc);
      }

      setSubmitted(true);
      toast.success("Application submitted successfully!");
      
      // If scholarship status is state topper or player, they might get auto-shortlisted
      if (data.scholarship_status !== 'none') {
        toast.success("Scholarship status noted. You may be eligible for priority consideration.");
      }
    } catch (err: any) {
      console.error("SUBMIT ERROR:", err?.response?.data);
      toast.error(
        err?.response?.data?.error || err?.response?.data?.message || "Submission failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-gray-500 mb-4">
            Your application has been submitted and is under review.
          </p>
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-600">Application ID</p>
            <p className="text-xl font-mono font-bold text-primary-700 mt-1">{applicantId}</p>
          </div>
          {enrollmentNumber && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-600">Enrollment Number</p>
              <p className="text-xl font-mono font-bold text-green-700 mt-1">{enrollmentNumber}</p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Link
              to="/applicant/dashboard"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              View Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#650C08] to-[#8B1A14] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-[#650C08]" />
              </div>
              <div>
                <p className="font-bold text-sm">University ERP</p>
                <p className="text-rose-200 text-xs">Admissions Portal</p>
              </div>
            </div>
            <Link to="/login" className="text-sm text-rose-200 hover:text-white transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= i
                        ? `bg-gradient-to-r ${s.color} text-white`
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > i ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 ${
                      step >= i ? "text-gray-900 font-semibold" : "text-gray-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > i ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Select Admission */}
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Select Admission Cycle</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Admission Cycle *
                </label>
                <select
                  {...register("cycle_id", { required: "Admission cycle is required" })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  onChange={(e) => {
                    const cycle = cycles.find((c) => c.id === Number(e.target.value));
                    setSelectedCycle(cycle || null);
                  }}
                >
                  <option value="">Select a cycle</option>
                  {cycles.map((cycle) => (
                    <option key={cycle.id} value={cycle.id}>
                      {cycle.name} - {cycle.academic_year}
                    </option>
                  ))}
                </select>
                {errors.cycle_id && (
                  <p className="text-red-600 text-sm mt-1">{errors.cycle_id.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Program *
                </label>
                <select
                  {...register("program_id", { required: "Program is required" })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                >
                  <option value="">Select a program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name} ({program.code})
                    </option>
                  ))}
                </select>
                {errors.program_id && (
                  <p className="text-red-600 text-sm mt-1">{errors.program_id.message}</p>
                )}
              </div>

              {selectedCycle && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Cycle Information</p>
                  <p className="text-sm text-blue-800">
                    Start Date: {new Date(selectedCycle.start_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-blue-800">
                    End Date: {new Date(selectedCycle.end_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {seatAvailability && (
                <div className={`rounded-xl p-4 ${seatAvailability.available ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-start gap-3">
                    <Users className={`w-5 h-5 mt-0.5 ${seatAvailability.available ? 'text-green-600' : 'text-red-600'}`} />
                    <div>
                      <p className={`font-semibold ${seatAvailability.available ? 'text-green-900' : 'text-red-900'}`}>
                        Seat Availability
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Total Seats</p>
                          <p className="font-semibold text-gray-900">{seatAvailability.total_seats}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Allocated</p>
                          <p className="font-semibold text-gray-900">{seatAvailability.allocated_seats}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Available</p>
                          <p className={`font-semibold ${seatAvailability.available ? 'text-green-600' : 'text-red-600'}`}>
                            {seatAvailability.available_seats}
                          </p>
                        </div>
                      </div>
                      {!seatAvailability.available && (
                        <p className="text-sm text-red-800 mt-2">
                          ⚠️ Seats are full for this program. Please choose another program or contact the admissions office.
                        </p>
                      )}
                      {seatAvailability.available && seatAvailability.available_seats <= 5 && (
                        <p className="text-sm text-yellow-800 mt-2">
                          ⚠️ Only {seatAvailability.available_seats} seats remaining. Apply soon!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    {...register("first_name", { required: "First name is required" })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    placeholder="John"
                  />
                  {errors.first_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.first_name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    {...register("last_name", { required: "Last name is required" })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    placeholder="Doe"
                  />
                  {errors.last_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    {...register("phone", { required: "Phone is required" })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    placeholder="9876543210"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    {...register("date_of_birth", { required: "Date of birth is required" })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  />
                  {errors.date_of_birth && (
                    <p className="text-red-600 text-sm mt-1">{errors.date_of_birth.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    {...register("gender_id", { required: "Gender is required" })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="">Select gender</option>
                    {genders.map((gender) => (
                      <option key={gender.id} value={gender.id}>
                        {gender.name}
                      </option>
                    ))}
                  </select>
                  {errors.gender_id && (
                    <p className="text-red-600 text-sm mt-1">{errors.gender_id.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register("category_id", { required: "Category is required" })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-red-600 text-sm mt-1">{errors.category_id.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  {...register("address", { required: "Address is required" })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  placeholder="Full address"
                />
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Academic Info */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Academic Information</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Previous Qualification *
                </label>
                <input
                  {...register("previous_qualification", { required: "Previous qualification is required" })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  placeholder="e.g., 12th Science, B.Sc., etc."
                />
                {errors.previous_qualification && (
                  <p className="text-red-600 text-sm mt-1">{errors.previous_qualification.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Previous Percentage (%) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("previous_percentage", { 
                    required: "Percentage is required",
                    min: { value: 0, message: "Percentage must be positive" },
                    max: { value: 100, message: "Percentage cannot exceed 100" }
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  placeholder="e.g., 85.5"
                />
                {errors.previous_percentage && (
                  <p className="text-red-600 text-sm mt-1">{errors.previous_percentage.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Scholarship Status
                </label>
                <select
                  {...register("scholarship_status")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                >
                  <option value="none">None</option>
                  <option value="state_topper">State Topper</option>
                  <option value="state_player">State Player (Sports)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  State toppers and state players may be eligible for scholarships and priority consideration.
                </p>
              </div>

              {streams.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stream/Specialization
                  </label>
                  <select
                    {...register("stream_id")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="">Select stream (optional)</option>
                    {streams.map((stream) => (
                      <option key={stream.id} value={stream.id}>
                        {stream.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Hostel & Transport */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Hostel & Transport</h2>
              
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-orange-900">Hostel Accommodation</p>
                    <p className="text-sm text-orange-800">
                      Choose if you require hostel accommodation during your studies.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("hostel_required")}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    I require hostel accommodation
                  </span>
                </label>
              </div>

              {hostelRequired && (
                <div className="ml-8 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hostel Type *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          {...register("hostel_type", { required: "Hostel type is required when hostel is needed" })}
                          value="ac"
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">AC Room</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          {...register("hostel_type")}
                          value="non_ac"
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Non-AC Room</span>
                      </label>
                    </div>
                    {errors.hostel_type && (
                      <p className="text-red-600 text-sm mt-1">{errors.hostel_type.message}</p>
                    )}
                  </div>
                </div>
              )}

              {!hostelRequired && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Bus className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900">Transport Facility</p>
                      <p className="text-sm text-blue-800">
                        If you don't require hostel, you may opt for transport facility.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!hostelRequired && (
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("transport_required")}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      I require transport facility
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Documents */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
              <p className="text-gray-500">
                Upload required documents. Accepted formats: PDF, JPG, PNG (Max 5MB each)
              </p>

              <div className="space-y-4">
                {[
                  { type: "marksheet", label: "Previous Qualification Marksheet", required: true },
                  { type: "transfer_certificate", label: "Transfer Certificate", required: true },
                  { type: "birth_certificate", label: "Birth Certificate", required: true },
                  { type: "id_proof", label: "ID Proof (Aadhar/PAN/Passport)", required: true },
                  { type: "passport_photo", label: "Passport Size Photo", required: true },
                  { type: "income_certificate", label: "Income Certificate (for scholarship)", required: false },
                  { type: "sports_certificate", label: "Sports Certificate (if applicable)", required: false },
                ].map((doc) => (
                  <div key={doc.type} className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-semibold text-gray-700">{doc.label}</p>
                          <p className="text-xs text-gray-500">
                            {doc.required ? "Required" : "Optional"}
                          </p>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(doc.type, file);
                          }
                        }}
                        className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                    </div>
                    {uploadedDocuments.find((d) => d.document_type === doc.type) && (
                      <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Uploaded</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
              
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium">{getValues("first_name")} {getValues("last_name")}</span>
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{getValues("email")}</span>
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium">{getValues("phone")}</span>
                  <span className="text-gray-500">Date of Birth:</span>
                  <span className="font-medium">{getValues("date_of_birth")}</span>
                </div>

                <h3 className="font-semibold text-gray-900 pt-4">Academic Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Qualification:</span>
                  <span className="font-medium">{getValues("previous_qualification")}</span>
                  <span className="text-gray-500">Percentage:</span>
                  <span className="font-medium">{getValues("previous_percentage")}%</span>
                  <span className="text-gray-500">Scholarship Status:</span>
                  <span className="font-medium capitalize">{getValues("scholarship_status")?.replace("_", " ")}</span>
                </div>

                <h3 className="font-semibold text-gray-900 pt-4">Hostel & Transport</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Hostel Required:</span>
                  <span className="font-medium">{getValues("hostel_required") ? "Yes" : "No"}</span>
                  {getValues("hostel_required") && (
                    <>
                      <span className="text-gray-500">Hostel Type:</span>
                      <span className="font-medium uppercase">{getValues("hostel_type")}</span>
                    </>
                  )}
                  {!getValues("hostel_required") && (
                    <>
                      <span className="text-gray-500">Transport Required:</span>
                      <span className="font-medium">{getValues("transport_required") ? "Yes" : "No"}</span>
                    </>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 pt-4">Documents</h3>
                <div className="text-sm">
                  <span className="text-gray-500">Uploaded: </span>
                  <span className="font-medium">{uploadedDocuments.length} documents</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900">Important Note</p>
                    <p className="text-sm text-yellow-800">
                      Once submitted, you cannot modify your application. Please review all details carefully.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
              >
                Previous
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={submitting}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
