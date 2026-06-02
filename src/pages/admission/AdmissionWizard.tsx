import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { AdmissionApplication } from "../../types/admissionPortal";
import Step1PersonalDetails from "./wizard/Step1PersonalDetails";
import Step2Payment from "./wizard/Step2Payment";
import Step3AcademicDetails from "./wizard/Step3AcademicDetails";
import Step4DocumentUpload from "./wizard/Step4DocumentUpload";
import Step5Scholarship from "./wizard/Step5Scholarship";
import Step6Declaration from "./wizard/Step6Declaration";

const steps = [
  { id: 1, title: "Personal Details", description: "Your personal information" },
  { id: 2, title: "Application Payment", description: "Pay application fee" },
  { id: 3, title: "Academic Details", description: "Your educational background" },
  { id: 4, title: "Document Upload", description: "Upload required documents" },
  { id: 5, title: "Scholarship", description: "Apply for scholarships" },
  { id: 6, title: "Declaration", description: "Review and submit" },
];

export default function AdmissionWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [applicationData, setApplicationData] = useState<Partial<AdmissionApplication>>({
    cycle_id: 1, // Default cycle ID
    program_id: 1, // Default program ID - should be selected from enquiry
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      toast.success("Draft saved successfully!");
    } catch (error) {
      toast.error("Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      toast.success("Application submitted successfully!");
      navigate("/student/tracking");
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationData = (stepData: any) => {
    setApplicationData((prev) => ({ ...prev, ...stepData }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalDetails
            data={applicationData.personal_details}
            onNext={handleNext}
            onSave={handleSaveDraft}
            onUpdate={(data) => updateApplicationData({ personal_details: data })}
          />
        );
      case 2:
        return (
          <Step2Payment
            data={applicationData.payment}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSave={handleSaveDraft}
            onUpdate={(data) => updateApplicationData({ payment: data })}
          />
        );
      case 3:
        return (
          <Step3AcademicDetails
            data={applicationData.academic_details}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSave={handleSaveDraft}
            onUpdate={(data) => updateApplicationData({ academic_details: data })}
          />
        );
      case 4:
        return (
          <Step4DocumentUpload
            data={applicationData.documents}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSave={handleSaveDraft}
            onUpdate={(data) => updateApplicationData({ documents: data })}
          />
        );
      case 5:
        return (
          <Step5Scholarship
            data={applicationData.scholarship}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSave={handleSaveDraft}
            onUpdate={(data) => updateApplicationData({ scholarship: data })}
          />
        );
      case 6:
        return (
          <Step6Declaration
            data={applicationData.declaration}
            applicationData={applicationData}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            onUpdate={(data) => updateApplicationData({ declaration: data })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-2 text-primary-200 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold mb-2">Admission Application</h1>
          <p className="text-primary-200">Complete your application in {steps.length} steps</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                      currentStep > step.id
                        ? "bg-green-600 text-white"
                        : currentStep === step.id
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-medium ${
                        currentStep >= step.id ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.id ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </div>

          {renderStep()}

          {/* Navigation Buttons */}
          {currentStep !== 6 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      {currentStep === steps.length ? "Submit" : "Next"}
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
