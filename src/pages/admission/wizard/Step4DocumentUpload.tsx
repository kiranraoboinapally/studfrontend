import { useState } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import type { UploadedDocuments, DocumentUpload, DocumentType } from "../../../types/admissionPortal";

interface Step4DocumentUploadProps {
  data?: UploadedDocuments;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onUpdate: (data: UploadedDocuments) => void;
}

const documentTypes: { type: DocumentType; label: string; required: boolean }[] = [
  { type: "passport_photo", label: "Passport Photo", required: true },
  { type: "signature", label: "Signature", required: true },
  { type: "aadhaar_card", label: "Aadhaar Card", required: true },
  { type: "tenth_marksheet", label: "10th Marksheet", required: true },
  { type: "twelfth_marksheet", label: "12th Marksheet", required: true },
  { type: "transfer_certificate", label: "Transfer Certificate", required: true },
  { type: "migration_certificate", label: "Migration Certificate", required: false },
  { type: "category_certificate", label: "Category Certificate", required: false },
  { type: "income_certificate", label: "Income Certificate", required: false },
  { type: "disability_certificate", label: "Disability Certificate", required: false },
];

export default function Step4DocumentUpload({ data, onNext, onPrevious, onSave, onUpdate }: Step4DocumentUploadProps) {
  const [uploading, setUploading] = useState<DocumentType | null>(null);
  const [documents, setDocuments] = useState<UploadedDocuments>(data || {});

  const handleFileUpload = async (type: DocumentType, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Only PDF, JPG, and PNG files are allowed");
      return;
    }

    setUploading(type);

    // Simulate upload progress
    const uploadData: DocumentUpload = {
      document_type: type,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      upload_status: "uploading",
      upload_progress: 0,
    };

    setDocuments((prev) => ({ ...prev, [type]: uploadData }));

    // Simulate upload
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        const completedUpload: DocumentUpload = {
          ...uploadData,
          upload_status: "uploaded",
          upload_progress: 100,
          file_url: URL.createObjectURL(file),
        };
        setDocuments((prev) => ({ ...prev, [type]: completedUpload }));
        setUploading(null);
      } else {
        setDocuments((prev) => ({
          ...prev,
          [type]: { ...uploadData, upload_progress: progress },
        }));
      }
    }, 500);
  };

  const handleRemoveDocument = (type: DocumentType) => {
    setDocuments((prev) => {
      const newDocs = { ...prev };
      delete newDocs[type];
      return newDocs;
    });
  };

  const handleNext = () => {
    onUpdate(documents);
    onNext();
  };

  const getRequiredCount = () => {
    return documentTypes.filter((doc) => doc.required).length;
  };

  const getUploadedRequiredCount = () => {
    return documentTypes
      .filter((doc) => doc.required)
      .filter((doc) => documents[doc.type]?.upload_status === "uploaded").length;
  };

  const canProceed = getUploadedRequiredCount() === getRequiredCount();

  return (
    <div className="space-y-6">
      {/* Upload Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Upload Instructions</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Supported formats: PDF, JPG, PNG</li>
          <li>• Maximum file size: 5 MB</li>
          <li>• Ensure documents are clear and readable</li>
          <li>• Required documents are marked with *</li>
        </ul>
      </div>

      {/* Progress */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Required Documents: {getUploadedRequiredCount()}/{getRequiredCount()}
          </span>
          <span className="text-sm text-gray-500">
            Total Uploaded: {Object.keys(documents).length}/{documentTypes.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${(getUploadedRequiredCount() / getRequiredCount()) * 100}%` }}
          />
        </div>
      </div>

      {/* Document Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((doc) => {
          const uploadedDoc = documents[doc.type];
          const isUploading = uploading === doc.type;

          return (
            <div
              key={doc.type}
              className={`border-2 rounded-lg p-4 transition-all ${
                uploadedDoc?.upload_status === "uploaded"
                  ? "border-green-500 bg-green-50"
                  : isUploading
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {doc.label}
                      {doc.required && <span className="text-red-500 ml-1">*</span>}
                    </p>
                  </div>
                </div>
                {uploadedDoc?.upload_status === "uploaded" && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {uploadedDoc?.upload_status === "failed" && (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
              </div>

              {uploadedDoc ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate flex-1">{uploadedDoc.file_name}</span>
                    <span className="text-gray-400 text-xs">
                      {(uploadedDoc.file_size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  {isUploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadedDoc.upload_progress || 0}%` }}
                      />
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveDocument(doc.type)}
                    className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                    disabled={isUploading}
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Choose file</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(doc.type, file);
                      }}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button onClick={onPrevious} className="btn-secondary" disabled={uploading !== null}>
          Previous
        </button>
        <div className="flex gap-3">
          <button onClick={onSave} className="btn-secondary" disabled={uploading !== null}>
            Save Draft
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed || uploading !== null}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
