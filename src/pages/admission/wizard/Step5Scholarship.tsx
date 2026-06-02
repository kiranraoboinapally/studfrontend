import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Award, Upload, TrendingUp, Trophy, DollarSign, FileText } from "lucide-react";
import type { ScholarshipApplication } from "../../../types/admissionPortal";

const scholarshipSchema = z.object({
  apply_for_scholarship: z.boolean(),
  scholarship_types: z.array(z.string()).optional(),
  merit_scholarship: z.object({
    tenth_percentage: z.number().optional(),
    twelfth_percentage: z.number().optional(),
  }).optional(),
  financial_assistance: z.object({
    annual_family_income: z.number().optional(),
  }).optional(),
  sports_scholarship: z.object({
    sports_level: z.string().optional(),
    achievement_details: z.string().optional(),
  }).optional(),
  reserved_category: z.object({}).optional(),
  special_scholarship: z.object({
    scholarship_type: z.string().optional(),
  }).optional(),
});

type ScholarshipFormData = z.infer<typeof scholarshipSchema>;

interface Step5ScholarshipProps {
  data?: ScholarshipApplication;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onUpdate: (data: ScholarshipApplication) => void;
}

export default function Step5Scholarship({ data, onNext, onPrevious, onSave, onUpdate }: Step5ScholarshipProps) {
  const {
    register,
    handleSubmit,
    watch,
  } = useForm<any>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: data || {
      apply_for_scholarship: false,
      scholarship_types: [],
    },
  });

  const applyForScholarship = watch("apply_for_scholarship");
  const scholarshipTypes = watch("scholarship_types") || [];

  const onSubmit = (formData: any) => {
    onUpdate(formData as ScholarshipApplication);
    onNext();
  };

  const toggleScholarshipType = (type: string) => {
    const currentTypes = scholarshipTypes as string[];
    if (currentTypes.includes(type)) {
      register("scholarship_types").onChange({
        target: { value: currentTypes.filter((t) => t !== type) },
      });
    } else {
      register("scholarship_types").onChange({
        target: { value: [...currentTypes, type] },
      });
    }
  };

  const scholarshipOptions = [
    { id: "merit", name: "Merit Scholarship", icon: Trophy, description: "Based on academic performance" },
    { id: "sports", name: "Sports Scholarship", icon: TrendingUp, description: "For outstanding sports achievements" },
    { id: "financial_assistance", name: "Financial Assistance", icon: DollarSign, description: "Based on family income" },
    { id: "reserved_category", name: "Reserved Category", icon: FileText, description: "For reserved category students" },
    { id: "special", name: "Special Scholarship", icon: Award, description: "Other special scholarships" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Scholarship Application Question */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            {...register("apply_for_scholarship")}
            className="w-5 h-5 text-primary-600 rounded mt-1"
          />
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              Do you want to apply for scholarship?
            </h3>
            <p className="text-primary-700 text-sm">
              Select this option if you wish to apply for any scholarship program. Various scholarships are available based on merit, sports, financial need, and category.
            </p>
          </div>
        </div>
      </div>

      {applyForScholarship && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
          {/* Scholarship Types */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Scholarship Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scholarshipOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = scholarshipTypes.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleScholarshipType(option.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      isSelected
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-600"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{option.name}</p>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Merit Scholarship Form */}
          {scholarshipTypes.includes("merit") && (
            <div className="bg-gray-50 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary-600" />
                Merit Scholarship Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">10th Percentage</label>
                  <input
                    {...register("merit_scholarship.tenth_percentage", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="input-field"
                    placeholder="Percentage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">12th Percentage</label>
                  <input
                    {...register("merit_scholarship.twelfth_percentage", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="input-field"
                    placeholder="Percentage"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Financial Assistance Form */}
          {scholarshipTypes.includes("financial_assistance") && (
            <div className="bg-gray-50 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary-600" />
                Financial Assistance Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Family Income</label>
                  <input
                    {...register("financial_assistance.annual_family_income", { valueAsNumber: true })}
                    type="number"
                    className="input-field"
                    placeholder="Annual income in INR"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Income Certificate</label>
                  <label className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Upload income certificate</span>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Sports Scholarship Form */}
          {scholarshipTypes.includes("sports") && (
            <div className="bg-gray-50 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                Sports Scholarship Details
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sports Level</label>
                  <select {...register("sports_scholarship.sports_level")} className="input-field">
                    <option value="">Select sports level</option>
                    <option value="district">District Level</option>
                    <option value="state">State Level</option>
                    <option value="national">National Level</option>
                    <option value="international">International Level</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achievement Details</label>
                  <textarea
                    {...register("sports_scholarship.achievement_details")}
                    className="input-field"
                    rows={3}
                    placeholder="Describe your sports achievements"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Upload</label>
                  <label className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Upload sports certificate</span>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Reserved Category Form */}
          {scholarshipTypes.includes("reserved_category") && (
            <div className="bg-gray-50 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                Reserved Category Scholarship
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Certificate</label>
                <label className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                  <Upload className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Upload category certificate</span>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* Special Scholarship Form */}
          {scholarshipTypes.includes("special") && (
            <div className="bg-gray-50 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-600" />
                Special Scholarship Details
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Type</label>
                  <input
                    {...register("special_scholarship.scholarship_type")}
                    className="input-field"
                    placeholder="Specify scholarship type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Documents</label>
                  <label className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Upload supporting documents</span>
                    <input type="file" className="hidden" multiple />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Estimated Scholarship Eligibility */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Estimated Scholarship Eligibility
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-green-700">Estimated Amount</p>
                <p className="text-2xl font-bold text-green-800">₹25,000</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Scholarship Percentage</p>
                <p className="text-2xl font-bold text-green-800">25%</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Final Fee Payable</p>
                <p className="text-2xl font-bold text-green-800">₹75,000</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button type="button" onClick={onPrevious} className="btn-secondary">
          Previous
        </button>
        <div className="flex gap-3">
          <button type="button" onClick={onSave} className="btn-secondary">
            Save Draft
          </button>
          <button type="submit" className="btn-primary">
            Save & Next
          </button>
        </div>
      </div>
    </form>
  );
}
