import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Phone, Mail, MapPin, Heart, Globe } from "lucide-react";
import type { PersonalDetails } from "../../../types/admissionPortal";

const personalDetailsSchema = z.object({
  // Applicant Information
  first_name: z.string().min(2, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(2, "Last name is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  blood_group: z.string().min(1, "Blood group is required"),
  nationality: z.string().min(1, "Nationality is required"),
  mother_tongue: z.string().min(1, "Mother tongue is required"),
  religion: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  marital_status: z.string().min(1, "Marital status is required"),
  aadhaar_number: z.string().regex(/^\d{12}$/, "Invalid Aadhaar number").optional().or(z.literal("")),
  passport_number: z.string().optional(),
  
  // Disability
  physically_challenged: z.boolean(),
  disability_type: z.string().optional(),
  disability_percentage: z.number().optional(),
  
  // Parent/Guardian Details
  guardian_type: z.enum(["father", "mother", "guardian"]),
  guardian_name: z.string().min(2, "Guardian name is required"),
  guardian_occupation: z.string().min(2, "Guardian occupation is required"),
  guardian_annual_income: z.number().min(0, "Invalid income"),
  guardian_mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  guardian_email: z.string().email("Invalid email"),
  
  // Permanent Address
  permanent_address_line1: z.string().min(5, "Address is required"),
  permanent_address_line2: z.string().optional(),
  permanent_country: z.string().min(1, "Country is required"),
  permanent_state: z.string().min(1, "State is required"),
  permanent_district: z.string().min(1, "District is required"),
  permanent_city: z.string().min(1, "City is required"),
  permanent_pin_code: z.string().regex(/^\d{6}$/, "Invalid pin code"),
  
  // Correspondence Address
  same_as_permanent: z.boolean(),
  correspondence_address_line1: z.string().optional(),
  correspondence_address_line2: z.string().optional(),
  correspondence_country: z.string().optional(),
  correspondence_state: z.string().optional(),
  correspondence_district: z.string().optional(),
  correspondence_city: z.string().optional(),
  correspondence_pin_code: z.string().optional(),
});

type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>;

interface Step1PersonalDetailsProps {
  data?: PersonalDetails;
  onNext: () => void;
  onSave: () => void;
  onUpdate: (data: PersonalDetails) => void;
}

export default function Step1PersonalDetails({ data, onNext, onSave, onUpdate }: Step1PersonalDetailsProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PersonalDetailsFormData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: data || {
      physically_challenged: false,
      guardian_type: "father",
      same_as_permanent: true,
    },
  });

  const physicallyChallenged = watch("physically_challenged");
  const sameAsPermanent = watch("same_as_permanent");

  const onSubmit = (formData: PersonalDetailsFormData) => {
    onUpdate(formData as PersonalDetails);
    onNext();
  };

  const handleSaveDraft = () => {
    onSave();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Applicant Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary-600" />
          Applicant Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input {...register("first_name")} className="input-field" placeholder="First name" />
            {errors.first_name && <p className="text-red-600 text-xs mt-1">{errors.first_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
            <input {...register("middle_name")} className="input-field" placeholder="Middle name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input {...register("last_name")} className="input-field" placeholder="Last name" />
            {errors.last_name && <p className="text-red-600 text-xs mt-1">{errors.last_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input {...register("date_of_birth")} type="date" className="input-field" />
            {errors.date_of_birth && <p className="text-red-600 text-xs mt-1">{errors.date_of_birth.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <select {...register("gender")} className="input-field">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-600 text-xs mt-1">{errors.gender.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
            <select {...register("blood_group")} className="input-field">
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            {errors.blood_group && <p className="text-red-600 text-xs mt-1">{errors.blood_group.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
            <input {...register("nationality")} className="input-field" placeholder="Nationality" />
            {errors.nationality && <p className="text-red-600 text-xs mt-1">{errors.nationality.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mother Tongue *</label>
            <input {...register("mother_tongue")} className="input-field" placeholder="Mother tongue" />
            {errors.mother_tongue && <p className="text-red-600 text-xs mt-1">{errors.mother_tongue.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select {...register("category")} className="input-field">
              <option value="">Select category</option>
              <option value="general">General</option>
              <option value="obc">OBC</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
              <option value="ews">EWS</option>
            </select>
            {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status *</label>
            <select {...register("marital_status")} className="input-field">
              <option value="">Select marital status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
            {errors.marital_status && <p className="text-red-600 text-xs mt-1">{errors.marital_status.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
            <input {...register("aadhaar_number")} className="input-field" placeholder="12 digit Aadhaar number" maxLength={12} />
            {errors.aadhaar_number && <p className="text-red-600 text-xs mt-1">{errors.aadhaar_number.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
            <input {...register("passport_number")} className="input-field" placeholder="Passport number" />
          </div>
        </div>
      </div>

      {/* Disability Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            {...register("physically_challenged")}
            className="w-4 h-4 text-primary-600 rounded"
          />
          <label className="text-sm font-medium text-gray-700">Physically Challenged?</label>
        </div>
        {physicallyChallenged && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disability Type</label>
              <input {...register("disability_type")} className="input-field" placeholder="Disability type" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disability Percentage</label>
              <input
                {...register("disability_percentage", { valueAsNumber: true })}
                type="number"
                className="input-field"
                placeholder="Percentage"
                min="0"
                max="100"
              />
            </div>
          </div>
        )}
      </div>

      {/* Parent/Guardian Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary-600" />
          Parent/Guardian Details
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Type *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" {...register("guardian_type")} value="father" className="text-primary-600" />
              <span className="text-sm">Father</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" {...register("guardian_type")} value="mother" className="text-primary-600" />
              <span className="text-sm">Mother</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" {...register("guardian_type")} value="guardian" className="text-primary-600" />
              <span className="text-sm">Guardian</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input {...register("guardian_name")} className="input-field" placeholder="Guardian name" />
            {errors.guardian_name && <p className="text-red-600 text-xs mt-1">{errors.guardian_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation *</label>
            <input {...register("guardian_occupation")} className="input-field" placeholder="Occupation" />
            {errors.guardian_occupation && <p className="text-red-600 text-xs mt-1">{errors.guardian_occupation.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income *</label>
            <input
              {...register("guardian_annual_income", { valueAsNumber: true })}
              type="number"
              className="input-field"
              placeholder="Annual income"
            />
            {errors.guardian_annual_income && <p className="text-red-600 text-xs mt-1">{errors.guardian_annual_income.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input {...register("guardian_mobile")} className="input-field pl-10" placeholder="Mobile number" />
            </div>
            {errors.guardian_mobile && <p className="text-red-600 text-xs mt-1">{errors.guardian_mobile.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input {...register("guardian_email")} type="email" className="input-field pl-10" placeholder="Email address" />
            </div>
            {errors.guardian_email && <p className="text-red-600 text-xs mt-1">{errors.guardian_email.message}</p>}
          </div>
        </div>
      </div>

      {/* Permanent Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-600" />
          Permanent Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
            <input {...register("permanent_address_line1")} className="input-field" placeholder="House/Flat No., Street" />
            {errors.permanent_address_line1 && <p className="text-red-600 text-xs mt-1">{errors.permanent_address_line1.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
            <input {...register("permanent_address_line2")} className="input-field" placeholder="Area, Locality" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <input {...register("permanent_country")} className="input-field" placeholder="Country" />
            {errors.permanent_country && <p className="text-red-600 text-xs mt-1">{errors.permanent_country.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <input {...register("permanent_state")} className="input-field" placeholder="State" />
            {errors.permanent_state && <p className="text-red-600 text-xs mt-1">{errors.permanent_state.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
            <input {...register("permanent_district")} className="input-field" placeholder="District" />
            {errors.permanent_district && <p className="text-red-600 text-xs mt-1">{errors.permanent_district.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input {...register("permanent_city")} className="input-field" placeholder="City" />
            {errors.permanent_city && <p className="text-red-600 text-xs mt-1">{errors.permanent_city.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code *</label>
            <input {...register("permanent_pin_code")} className="input-field" placeholder="Pin code" maxLength={6} />
            {errors.permanent_pin_code && <p className="text-red-600 text-xs mt-1">{errors.permanent_pin_code.message}</p>}
          </div>
        </div>
      </div>

      {/* Correspondence Address */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            {...register("same_as_permanent")}
            className="w-4 h-4 text-primary-600 rounded"
          />
          <label className="text-sm font-medium text-gray-700">Current Address Same As Permanent</label>
        </div>
        {!sameAsPermanent && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-600" />
              Correspondence Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input {...register("correspondence_address_line1")} className="input-field" placeholder="House/Flat No., Street" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input {...register("correspondence_address_line2")} className="input-field" placeholder="Area, Locality" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input {...register("correspondence_country")} className="input-field" placeholder="Country" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input {...register("correspondence_state")} className="input-field" placeholder="State" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input {...register("correspondence_district")} className="input-field" placeholder="District" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input {...register("correspondence_city")} className="input-field" placeholder="City" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                <input {...register("correspondence_pin_code")} className="input-field" placeholder="Pin code" maxLength={6} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={handleSaveDraft} className="btn-secondary">
          Save Draft
        </button>
        <button type="submit" className="btn-primary">
          Save & Next
        </button>
      </div>
    </form>
  );
}
