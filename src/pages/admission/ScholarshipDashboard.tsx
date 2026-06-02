import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Award, DollarSign, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";
import type { ScholarshipStatus } from "../../types/admissionPortal";
import { getScholarshipStatus } from "../../api/services/admissionPortalService";

export default function ScholarshipDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scholarshipData, setScholarshipData] = useState<ScholarshipStatus | null>(null);

  useEffect(() => {
    loadScholarshipData();
  }, []);

  const loadScholarshipData = async () => {
    try {
      const response = await getScholarshipStatus(1); // Application ID
      if (response.success) {
        setScholarshipData(response.data || null);
      }
    } catch (error) {
      console.error("Error loading scholarship data:", error);
      setScholarshipData(getMockScholarshipData());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scholarship data...</p>
        </div>
      </div>
    );
  }

  const data = scholarshipData || getMockScholarshipData();

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
          <h1 className="text-3xl font-bold mb-2">Scholarship Dashboard</h1>
          <p className="text-primary-200">View your scholarship application status</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Scholarship Status Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Scholarship Status</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                data.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : data.status === "Under Review"
                  ? "bg-yellow-100 text-yellow-700"
                  : data.status === "Rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {data.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-primary-700">Scholarship Type</span>
              </div>
              <p className="text-lg font-semibold text-primary-900">{data.type}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700">Approved Amount</span>
              </div>
              <p className="text-lg font-semibold text-green-900">
                {data.amount ? `₹${data.amount.toLocaleString()}` : "N/A"}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-700">Scholarship Percentage</span>
              </div>
              <p className="text-lg font-semibold text-blue-900">
                {data.percentage ? `${data.percentage}%` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Fee Breakdown</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Total Fee</span>
              <span className="font-semibold">₹100,000</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Scholarship Amount</span>
              <span className="font-semibold text-green-600">-₹{data.amount?.toLocaleString() || "0"}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-primary-50 px-4 rounded-lg">
              <span className="font-semibold text-primary-900">Final Fee Payable</span>
              <span className="font-bold text-xl text-primary-700">
                ₹{((100000 - (data.amount || 0))).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Application Submitted</p>
                <p className="text-sm text-gray-600">Your scholarship application has been submitted</p>
                <p className="text-xs text-gray-400 mt-1">Jan 15, 2024</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Document Verification</p>
                <p className="text-sm text-gray-600">Supporting documents verified successfully</p>
                <p className="text-xs text-gray-400 mt-1">Jan 16, 2024</p>
              </div>
            </div>

            {data.status === "Under Review" && (
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Under Review</p>
                  <p className="text-sm text-gray-600">Your application is being reviewed by the scholarship committee</p>
                  <p className="text-xs text-gray-400 mt-1">In Progress</p>
                </div>
              </div>
            )}

            {data.status === "Approved" && (
              <>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Review Completed</p>
                    <p className="text-sm text-gray-600">Scholarship committee has reviewed your application</p>
                    <p className="text-xs text-gray-400 mt-1">Jan 18, 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Scholarship Approved</p>
                    <p className="text-sm text-gray-600">Congratulations! Your scholarship has been approved</p>
                    <p className="text-xs text-gray-400 mt-1">Jan 20, 2024</p>
                  </div>
                </div>
              </>
            )}

            {data.status === "Rejected" && (
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Scholarship Rejected</p>
                  <p className="text-sm text-gray-600">Unfortunately, your scholarship application was not approved</p>
                  <p className="text-xs text-gray-400 mt-1">Jan 18, 2024</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/student/apply")}
            className="btn-primary flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View Application
          </button>
          {data.status === "Approved" && (
            <button className="btn-secondary flex items-center gap-2">
              <Award className="w-4 h-4" />
              Download Letter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// function getMockScholarshipData(): ScholarshipStatus {
//   return {
//     type: "Merit Scholarship",
//     status: "Under Review",
//     amount: 25000,
//     percentage: 25,
//   };
// }
