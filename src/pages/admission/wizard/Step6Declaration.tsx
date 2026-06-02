import { useState } from "react";
import { CheckCircle, FileText, AlertTriangle } from "lucide-react";
import type { Declaration, AdmissionApplication } from "../../../types/admissionPortal";

interface Step6DeclarationProps {
  applicationData?: Partial<AdmissionApplication>;
  onPrevious: () => void;
  onSubmit: () => void;
  onUpdate: (data: Declaration) => void;
}

export default function Step6Declaration({ applicationData, onPrevious, onSubmit, onUpdate }: Step6DeclarationProps) {
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const declarationData: Declaration = {
      declaration_accepted: true,
      declaration_date: new Date().toISOString(),
      application_submitted: true,
      submission_date: new Date().toISOString(),
    };
    onUpdate(declarationData);
    onSubmit();
  };

  return (
    <div className="space-y-6">
      {/* Application Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Application Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-700">Program</p>
            <p className="font-medium text-blue-900">B.Tech Computer Science</p>
          </div>
          <div>
            <p className="text-sm text-blue-700">Application ID</p>
            <p className="font-medium text-blue-900">APP2024001</p>
          </div>
          <div>
            <p className="text-sm text-blue-700">Application Fee</p>
            <p className="font-medium text-blue-900">₹1,000 (Paid)</p>
          </div>
          <div>
            <p className="text-sm text-blue-700">Scholarship Applied</p>
            <p className="font-medium text-blue-900">
              {applicationData?.scholarship?.apply_for_scholarship ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Application Checklist</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Personal Details Completed</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Application Fee Paid</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Academic Details Completed</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Documents Uploaded</span>
          </div>
          
          {applicationData?.scholarship?.apply_for_scholarship && (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800">Scholarship Application Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Declaration */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Declaration
        </h3>
        <div className="space-y-4">
          <p className="text-yellow-800 text-sm leading-relaxed">
            I hereby declare that all information provided by me in this application form is true, accurate, and complete to the best of my knowledge. I understand that any false or misleading information may result in the rejection of my application or cancellation of admission, if granted.
          </p>
          <p className="text-yellow-800 text-sm leading-relaxed">
            I agree to abide by the rules and regulations of the university and understand that the university reserves the right to verify any information provided in this application.
          </p>
          <div className="flex items-start gap-3 pt-4">
            <input
              type="checkbox"
              checked={declarationAccepted}
              onChange={(e) => setDeclarationAccepted(e.target.checked)}
              className="w-5 h-5 text-yellow-600 rounded mt-1"
            />
            <label className="text-sm text-yellow-900 font-medium">
              I hereby declare that all information provided by me is true and accurate.
            </label>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>After submission, you cannot modify the application details.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>Keep your application ID safe for future reference.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>You can track your application status using the Application Tracking page.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>Original documents will be verified during the admission process.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-1">•</span>
            <span>Contact the admission office for any queries.</span>
          </li>
        </ul>
      </div>

      <div className="flex justify-between">
        <button onClick={onPrevious} className="btn-secondary" disabled={submitting}>
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={!declarationAccepted || submitting}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Submit Application
            </>
          )}
        </button>
      </div>
    </div>
  );
}
