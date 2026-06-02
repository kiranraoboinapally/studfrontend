import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  Smartphone, Mail, Shield, RefreshCw, Loader2,
  ArrowLeft, ChevronRight
} from "lucide-react";
import type { OTPVerification } from "../../types/admissionPortal";
import {
  verifyOTP,
  resendOTP,
} from "../../api/services/admissionPortalService";

// Validation Schema
const otpSchema = z.object({
  mobile_otp: z.string().length(6, "Mobile OTP must be 6 digits"),
  email_otp: z.string().length(6, "Email OTP must be 6 digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [resendingMobile, setResendingMobile] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const { mobile, email } = location.state || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: OTPFormData) => {
    setLoading(true);
    try {
      const otpData: OTPVerification = {
        mobile_otp: data.mobile_otp,
        email_otp: data.email_otp,
        mobile_verified: false,
        email_verified: false,
      };

      const response = await verifyOTP(otpData);
      if (response.success) {
        toast.success("Account Created Successfully!");
        // Store token
        localStorage.setItem("token", response.data?.token || "");
        localStorage.setItem("user_id", response.data?.user_id?.toString() || "");
        // Navigate to student dashboard
        navigate("/student/dashboard");
      } else {
        toast.error(response.error || "OTP verification failed");
      }
    } catch (error: any) {
      toast.error(error.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async (type: 'mobile' | 'email') => {
    if (type === 'mobile') {
      setResendingMobile(true);
    } else {
      setResendingEmail(true);
    }

    try {
      const response = await resendOTP(type);
      if (response.success) {
        toast.success(`${type === 'mobile' ? 'Mobile' : 'Email'} OTP resent successfully`);
        setCountdown(30);
      } else {
        toast.error(response.error || "Failed to resend OTP");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      if (type === 'mobile') {
        setResendingMobile(false);
      } else {
        setResendingEmail(false);
      }
    }
  };

  const handleBack = () => {
    navigate("/enquiry");
  };

  if (!mobile || !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Invalid access. Please start from enquiry form.</p>
          <button
            onClick={handleBack}
            className="btn-primary"
          >
            Go to Enquiry Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-primary-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold mb-2">OTP Verification</h1>
          <p className="text-primary-200">Verify your mobile number and email address</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="card">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Security Verification
                </p>
                <p className="text-sm text-blue-600">
                  We've sent a 6-digit OTP to your mobile number and email address.
                  Please enter both OTPs below to verify your account.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Mobile Number</span>
              </div>
              <p className="text-gray-900 font-semibold">{mobile}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Email Address</span>
              </div>
              <p className="text-gray-900 font-semibold">{email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Mobile OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile OTP *
              </label>
              <div className="relative">
                <input
                  {...register("mobile_otp")}
                  type="text"
                  maxLength={6}
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>
              {errors.mobile_otp && (
                <p className="text-red-600 text-sm mt-1">{errors.mobile_otp.message}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  Enter the 6-digit OTP sent to your mobile
                </p>
                <button
                  type="button"
                  onClick={() => handleResendOTP('mobile')}
                  disabled={countdown > 0 || resendingMobile}
                  className="text-sm text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {resendingMobile ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3" />
                      Resend OTP
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Email OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email OTP *
              </label>
              <div className="relative">
                <input
                  {...register("email_otp")}
                  type="text"
                  maxLength={6}
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>
              {errors.email_otp && (
                <p className="text-red-600 text-sm mt-1">{errors.email_otp.message}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  Enter the 6-digit OTP sent to your email
                </p>
                <button
                  type="button"
                  onClick={() => handleResendOTP('email')}
                  disabled={countdown > 0 || resendingEmail}
                  className="text-sm text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {resendingEmail ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3" />
                      Resend OTP
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Verify Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 px-8 py-3 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Create Account
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the OTP? Check your spam folder or contact support at{" "}
            <a href="mailto:support@university.edu" className="text-primary-600 hover:underline">
              support@university.edu
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
