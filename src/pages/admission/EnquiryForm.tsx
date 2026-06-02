import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  User, Phone, Mail, MapPin, GraduationCap, ChevronRight,
  Building2, Loader2
} from "lucide-react";
import {
  EnquiryForm as EnquiryFormType,
} from "../../types/admissionPortal";
import {
  submitEnquiry,
  getCountries,
  getStates,
  getDistricts,
  getCampuses,
  getDegreeTypes,
  getProgramsByDegreeType,
} from "../../api/services/admissionPortalService";

// Validation Schema
const enquirySchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  mobile_number: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  email_address: z.string().email("Invalid email address"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  preferred_campus: z.string().min(1, "Preferred campus is required"),
  qualification_type: z.string().min(1, "Qualification type is required"),
  program: z.string().optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export default function EnquiryForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [degreeTypes, setDegreeTypes] = useState<string[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
  });

  const watchedQualificationType = watch("qualification_type");
  const watchedCountry = watch("country");
  const watchedState = watch("state");

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load programs when qualification type changes
  useEffect(() => {
    if (watchedQualificationType) {
      loadProgramsByDegreeType(watchedQualificationType);
    } else {
      setPrograms([]);
    }
  }, [watchedQualificationType]);

  // Load states when country changes
  useEffect(() => {
    if (watchedCountry) {
      loadStates(watchedCountry);
    }
  }, [watchedCountry]);

  // Load districts when state changes
  useEffect(() => {
    if (watchedState) {
      loadDistricts(watchedState);
    }
  }, [watchedState]);

  const loadInitialData = async () => {
    try {
      const [countriesRes, campusesRes, degreeTypesRes] = await Promise.all([
        getCountries(),
        getCampuses(),
        getDegreeTypes(),
      ]);
      if (countriesRes.success) setCountries(Array.isArray(countriesRes.data) ? countriesRes.data : []);
      if (campusesRes.success) setCampuses(Array.isArray(campusesRes.data) ? campusesRes.data : []);
      if (degreeTypesRes.success) setDegreeTypes(Array.isArray(degreeTypesRes.data) ? degreeTypesRes.data : []);
    } catch (error) {
      console.error("Error loading initial data:", error);
      // Set empty arrays - no dummy data
      setCountries([]);
      setCampuses([]);
      setDegreeTypes([]);
    }
  };

  const loadProgramsByDegreeType = async (degreeType: string) => {
    try {
      const response = await getProgramsByDegreeType(degreeType);
      if (response.success) {
        setPrograms(response.data || []);
      }
    } catch (error: any) {
      console.error("Error loading programs by degree type:", error);
      setPrograms([]);
    }
  };

  const loadStates = async (countryId: string) => {
    try {
      const response = await getStates(countryId);
      if (response.success) {
        setStates(response.data || []);
        setValue("state", "");
        setValue("district", "");
      }
    } catch (error) {
      console.error("Error loading states:", error);
    }
  };

  const loadDistricts = async (stateId: string) => {
    try {
      const response = await getDistricts(stateId);
      if (response.success) {
        setDistricts(Array.isArray(response.data) ? response.data : []);
        setValue("district", "");
      }
    } catch (error) {
      console.error("Error loading districts:", error);
      setDistricts([]);
    }
  };

  const onSubmit = async (data: EnquiryFormData) => {
    setLoading(true);
    try {
      const response = await submitEnquiry(data as EnquiryFormType);
      if (response.success) {
        toast.success("Enquiry submitted successfully!");
        // Navigate to OTP verification
        navigate("/otp-verification", { state: { enquiryId: response.data?.enquiry_id, mobile: data.mobile_number, email: data.email_address } });
      } else {
        toast.error(response.error || "Failed to submit enquiry");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit enquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Enquiry & Lead Registration</h1>
          <p className="text-primary-200">Start your admission journey with us</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-100 rounded-lg">
                <User className="w-5 h-5 text-primary-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  {...register("full_name")}
                  type="text"
                  className="input-field"
                  placeholder="Enter your full name"
                />
                {errors.full_name && (
                  <p className="text-red-600 text-sm mt-1">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register("mobile_number")}
                    type="tel"
                    className="input-field pl-10"
                    placeholder="Enter mobile number"
                  />
                </div>
                {errors.mobile_number && (
                  <p className="text-red-600 text-sm mt-1">{errors.mobile_number.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register("email_address")}
                    type="email"
                    className="input-field pl-10"
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email_address && (
                  <p className="text-red-600 text-sm mt-1">{errors.email_address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Campus *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select {...register("preferred_campus")} className="input-field pl-10">
                    <option value="">Select campus</option>
                    {campuses.map((campus) => (
                      <option key={campus.id} value={campus.id}>
                        {campus.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.preferred_campus && (
                  <p className="text-red-600 text-sm mt-1">{errors.preferred_campus.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-100 rounded-lg">
                <MapPin className="w-5 h-5 text-primary-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Location Information</h2>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select {...register("country")} className="input-field">
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select {...register("state")} className="input-field" disabled={!watchedCountry}>
                  <option value="">Select state</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <select {...register("district")} className="input-field" disabled={!watchedState}>
                  <option value="">Select district</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-red-600 text-sm mt-1">{errors.district.message}</p>
                )}
              </div>
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Country */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Country *
    </label>
    <input
      {...register("country")}
      type="text"
      className="input-field"
      placeholder="Enter country"
    />
    {errors.country && (
      <p className="text-red-600 text-sm mt-1">
        {errors.country.message}
      </p>
    )}
  </div>

  {/* State */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      State *
    </label>
    <input
      {...register("state")}
      type="text"
      className="input-field"
      placeholder="Enter state"
    />
    {errors.state && (
      <p className="text-red-600 text-sm mt-1">
        {errors.state.message}
      </p>
    )}
  </div>

  {/* District */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      District *
    </label>
    <input
      {...register("district")}
      type="text"
      className="input-field"
      placeholder="Enter district"
    />
    {errors.district && (
      <p className="text-red-600 text-sm mt-1">
        {errors.district.message}
      </p>
    )}
  </div>
</div>
          </div>

          {/* Program Interest */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-100 rounded-lg">
                <GraduationCap className="w-5 h-5 text-primary-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Program Interest</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Qualification Type *
              </label>
              <select {...register("qualification_type")} className="input-field">
                <option value="">Select qualification type</option>
                {degreeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.qualification_type && (
                <p className="text-red-600 text-sm mt-1">{errors.qualification_type.message}</p>
              )}
            </div>

            {watchedQualificationType && programs.length > 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Program */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program *
                  </label>
                  <select {...register("program")} className="input-field">
                    <option value="">Select program</option>
                    {programs.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.name} ({prog.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 px-8 py-3 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Register Now
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
