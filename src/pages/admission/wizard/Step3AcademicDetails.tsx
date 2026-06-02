import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, BookOpen } from "lucide-react";
import type { AcademicDetails } from "../../../types/admissionPortal";

const academicDetailsSchema = z.object({
  // 10th Qualification
  tenth_board: z.string().min(1, "Board is required"),
  tenth_school: z.string().min(1, "School is required"),
  tenth_year: z.string().min(4, "Year is required"),
  tenth_percentage: z.number().min(0).max(100),
  
  // 12th Qualification
  twelfth_board: z.string().min(1, "Board is required"),
  twelfth_school: z.string().min(1, "School is required"),
  twelfth_year: z.string().min(4, "Year is required"),
  twelfth_percentage: z.number().min(0).max(100),
  
  // Diploma Details
  has_diploma: z.boolean(),
  diploma_institute: z.string().optional(),
  diploma_university: z.string().optional(),
  diploma_percentage: z.number().optional(),
  diploma_passing_year: z.string().optional(),
  
  // UG Details
  has_ug: z.boolean(),
  ug_degree: z.string().optional(),
  ug_university: z.string().optional(),
  ug_cgpa: z.number().optional(),
  ug_percentage: z.number().optional(),
  ug_passing_year: z.string().optional(),
  
  // Entrance Exam
  entrance_exam_name: z.string().optional(),
  entrance_exam_score: z.number().optional(),
  entrance_exam_rank: z.number().optional(),
});

type AcademicDetailsFormData = z.infer<typeof academicDetailsSchema>;

interface Step3AcademicDetailsProps {
  data?: AcademicDetails;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onUpdate: (data: AcademicDetails) => void;
}

export default function Step3AcademicDetails({ data, onNext, onPrevious, onSave, onUpdate }: Step3AcademicDetailsProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AcademicDetailsFormData>({
    resolver: zodResolver(academicDetailsSchema),
    defaultValues: data || {
      has_diploma: false,
      has_ug: false,
    },
  });

  const hasDiploma = watch("has_diploma");
  const hasUG = watch("has_ug");

  const onSubmit = (formData: AcademicDetailsFormData) => {
    onUpdate(formData as AcademicDetails);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 10th Qualification */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary-600" />
          10th Qualification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Board *</label>
            <input {...register("tenth_board")} className="input-field" placeholder="Board name" />
            {errors.tenth_board && <p className="text-red-600 text-xs mt-1">{errors.tenth_board.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School *</label>
            <input {...register("tenth_school")} className="input-field" placeholder="School name" />
            {errors.tenth_school && <p className="text-red-600 text-xs mt-1">{errors.tenth_school.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year of Passing *</label>
            <input {...register("tenth_year")} type="number" className="input-field" placeholder="YYYY" />
            {errors.tenth_year && <p className="text-red-600 text-xs mt-1">{errors.tenth_year.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Percentage *</label>
            <input
              {...register("tenth_percentage", { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="input-field"
              placeholder="Percentage"
            />
            {errors.tenth_percentage && <p className="text-red-600 text-xs mt-1">{errors.tenth_percentage.message}</p>}
          </div>
        </div>
      </div>

      {/* 12th Qualification */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" />
          12th Qualification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Board *</label>
            <input {...register("twelfth_board")} className="input-field" placeholder="Board name" />
            {errors.twelfth_board && <p className="text-red-600 text-xs mt-1">{errors.twelfth_board.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School *</label>
            <input {...register("twelfth_school")} className="input-field" placeholder="School name" />
            {errors.twelfth_school && <p className="text-red-600 text-xs mt-1">{errors.twelfth_school.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year of Passing *</label>
            <input {...register("twelfth_year")} type="number" className="input-field" placeholder="YYYY" />
            {errors.twelfth_year && <p className="text-red-600 text-xs mt-1">{errors.twelfth_year.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Percentage *</label>
            <input
              {...register("twelfth_percentage", { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="input-field"
              placeholder="Percentage"
            />
            {errors.twelfth_percentage && <p className="text-red-600 text-xs mt-1">{errors.twelfth_percentage.message}</p>}
          </div>
        </div>
      </div>

      {/* Diploma Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            {...register("has_diploma")}
            className="w-4 h-4 text-primary-600 rounded"
          />
          <label className="text-sm font-medium text-gray-700">Have Diploma Qualification?</label>
        </div>
        {hasDiploma && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institute</label>
              <input {...register("diploma_institute")} className="input-field" placeholder="Institute name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <input {...register("diploma_university")} className="input-field" placeholder="University name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
              <input
                {...register("diploma_percentage", { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="input-field"
                placeholder="Percentage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passing Year</label>
              <input {...register("diploma_passing_year")} type="number" className="input-field" placeholder="YYYY" />
            </div>
          </div>
        )}
      </div>

      {/* UG Details (For PG Admissions) */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            {...register("has_ug")}
            className="w-4 h-4 text-primary-600 rounded"
          />
          <label className="text-sm font-medium text-gray-700">Have UG Qualification? (For PG Admissions)</label>
        </div>
        {hasUG && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <input {...register("ug_degree")} className="input-field" placeholder="Degree name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <input {...register("ug_university")} className="input-field" placeholder="University name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
              <input
                {...register("ug_cgpa", { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="input-field"
                placeholder="CGPA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
              <input
                {...register("ug_percentage", { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="input-field"
                placeholder="Percentage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passing Year</label>
              <input {...register("ug_passing_year")} type="number" className="input-field" placeholder="YYYY" />
            </div>
          </div>
        )}
      </div>

      {/* Entrance Exam Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Entrance Exam Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
            <input {...register("entrance_exam_name")} className="input-field" placeholder="e.g., JEE, NEET" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
            <input
              {...register("entrance_exam_score", { valueAsNumber: true })}
              type="number"
              className="input-field"
              placeholder="Score"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
            <input
              {...register("entrance_exam_rank", { valueAsNumber: true })}
              type="number"
              className="input-field"
              placeholder="Rank"
            />
          </div>
        </div>
      </div>

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
