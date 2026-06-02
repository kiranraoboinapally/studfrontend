import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";
import type { ApplicationStage } from "../../types/admissionPortal";
import { getApplicationTimeline } from "../../api/services/admissionPortalService";

const allStages: ApplicationStage[] = [
  "enquiry_submitted",
  "lead_assigned",
  "counsellor_contacted",
  "registered",
  "application_in_progress",
  "application_submitted",
  "scholarship_requested",
  "scholarship_under_review",
  "scholarship_approved",
  "payment_completed",
  "document_verification",
  "admission_approved",
  "enrollment_completed",
];

const stageLabels: Record<ApplicationStage, string> = {
  enquiry_submitted: "Enquiry Submitted",
  lead_assigned: "Lead Assigned",
  counsellor_contacted: "Counsellor Contacted",
  registered: "Registered",
  application_in_progress: "Application In Progress",
  application_submitted: "Application Submitted",
  scholarship_requested: "Scholarship Requested",
  scholarship_under_review: "Scholarship Under Review",
  scholarship_approved: "Scholarship Approved",
  payment_completed: "Payment Completed",
  document_verification: "Document Verification",
  admission_approved: "Admission Approved",
  enrollment_completed: "Enrollment Completed",
};

const stageDescriptions: Record<ApplicationStage, string> = {
  enquiry_submitted: "Your enquiry has been submitted successfully",
  lead_assigned: "A counsellor has been assigned to help you",
  counsellor_contacted: "Our counsellor has contacted you",
  registered: "You have registered on the portal",
  application_in_progress: "You are filling out the application form",
  application_submitted: "Application submitted for review",
  scholarship_requested: "Scholarship application submitted",
  scholarship_under_review: "Scholarship is under review",
  scholarship_approved: "Scholarship has been approved",
  payment_completed: "Application fee payment completed",
  document_verification: "Documents are being verified",
  admission_approved: "Congratulations! Admission approved",
  enrollment_completed: "Enrollment process completed",
};

export default function ApplicationTracking() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState<ApplicationStage>("enquiry_submitted");

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    try {
      const response = await getApplicationTimeline(1); // Application ID
      if (response.success && response.data) {
        const current = response.data.find((t) => t.status === "current");
        if (current) setCurrentStage(current.stage as ApplicationStage);
      }
    } catch (error) {
      console.error("Error loading timeline:", error);
      toast.error("Failed to load timeline data");
    } finally {
      setLoading(false);
    }
  };

  const getStageStatus = (stage: ApplicationStage): "completed" | "current" | "pending" => {
    const stageIndex = allStages.indexOf(stage);
    const currentIndex = allStages.indexOf(currentStage);
    if (stageIndex < currentIndex) return "completed";
    if (stageIndex === currentIndex) return "current";
    return "pending";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-2 text-primary-200 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold mb-2">Application Tracking</h1>
          <p className="text-primary-200">Track your admission progress in real-time</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Application Info */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Application ID: APP2024001</h3>
              <p className="text-gray-600">B.Tech Computer Science</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Current Stage</p>
              <p className="text-lg font-semibold text-primary-600">{stageLabels[currentStage]}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Admission Timeline</h2>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Timeline Items */}
            <div className="space-y-8">
              {allStages.map((stage, index) => {
                const status = getStageStatus(stage);
                const isCompleted = status === "completed";
                const isCurrent = status === "current";
                const isPending = status === "pending";

                return (
                  <div key={stage} className="relative flex items-start gap-6">
                    {/* Icon */}
                    <div className="relative z-10">
                      {isCompleted ? (
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center animate-pulse">
                          <Clock className="w-6 h-6 text-primary-600" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-gray-300 rounded-full" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pb-8 ${index === allStages.length - 1 ? "pb-0" : ""}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3
                          className={`text-lg font-semibold ${
                            isCompleted
                              ? "text-green-700"
                              : isCurrent
                              ? "text-primary-700"
                              : "text-gray-400"
                          }`}
                        >
                          {stageLabels[stage]}
                        </h3>
                        {isCompleted && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Completed
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                            In Progress
                          </span>
                        )}
                        {isPending && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          isCompleted || isCurrent ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {stageDescriptions[stage]}
                      </p>
                      {isCurrent && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            This stage is currently in progress. You will be notified when it's completed.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {allStages.indexOf(currentStage)}
              </p>
              <p className="text-sm text-green-700">Stages Completed</p>
            </div>
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <p className="text-3xl font-bold text-primary-600">
                {allStages.length - allStages.indexOf(currentStage) - 1}
              </p>
              <p className="text-sm text-primary-700">Stages Remaining</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-600">
                {Math.round((allStages.indexOf(currentStage) / allStages.length) * 100)}%
              </p>
              <p className="text-sm text-gray-700">Overall Progress</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate("/student/apply")}
            className="btn-primary flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View Application
          </button>
          <button
            onClick={() => navigate("/student/documents")}
            className="btn-secondary"
          >
            View Documents
          </button>
        </div>
      </div>
    </div>
  );
}

// function getMockTimeline(): TimelineEvent[] {
//   return [
//     { stage: "enquiry_submitted", title: "Enquiry Submitted", description: "Your enquiry has been submitted", status: "completed" },
//     { stage: "lead_assigned", title: "Lead Assigned", description: "Counsellor assigned", status: "completed" },
//     { stage: "counsellor_contacted", title: "Counsellor Contacted", description: "Counsellor contacted you", status: "completed" },
//     { stage: "registered", title: "Registered", description: "Registration completed", status: "completed" },
//     { stage: "application_in_progress", title: "Application In Progress", description: "Filling application", status: "completed" },
//     { stage: "application_submitted", title: "Application Submitted", description: "Application submitted", status: "completed" },
//     { stage: "scholarship_requested", title: "Scholarship Requested", description: "Scholarship applied", status: "completed" },
//     { stage: "scholarship_under_review", title: "Scholarship Under Review", description: "Review in progress", status: "completed" },
//     { stage: "scholarship_approved", title: "Scholarship Approved", description: "Scholarship approved", status: "completed" },
//     { stage: "payment_completed", title: "Payment Completed", description: "Fee paid", status: "completed" },
//     { stage: "document_verification", title: "Document Verification", description: "Verifying documents", status: "current" },
//     { stage: "admission_approved", title: "Admission Approved", description: "Admission approval pending", status: "pending" },
//     { stage: "enrollment_completed", title: "Enrollment Completed", description: "Enrollment pending", status: "pending" },
//   ];
// }
