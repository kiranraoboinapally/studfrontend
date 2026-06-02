import { useState } from "react";
import { CreditCard, Smartphone, Building2, CheckCircle, Download } from "lucide-react";
import type { ApplicationPayment } from "../../../types/admissionPortal";

interface Step2PaymentProps {
  data?: ApplicationPayment;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onUpdate: (data: ApplicationPayment) => void;
}

export default function Step2Payment({ data, onNext, onPrevious, onSave, onUpdate }: Step2PaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>(data?.payment_method || "");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const applicationFee = 1000; // This should come from backend

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      const paymentData: ApplicationPayment = {
        application_fee: applicationFee,
        payment_method: selectedMethod as any,
        payment_status: "completed",
        transaction_id: "TXN" + Date.now(),
        payment_date: new Date().toISOString(),
        receipt_url: "/receipts/" + Date.now() + ".pdf",
      };
      onUpdate(paymentData);
    }, 2000);
  };

  const handleNext = () => {
    if (paymentSuccess) {
      onNext();
    }
  };

  const paymentMethods = [
    { id: "UPI", name: "UPI", icon: Smartphone, description: "Pay using UPI apps" },
    { id: "Credit Card", name: "Credit Card", icon: CreditCard, description: "Pay using credit card" },
    { id: "Debit Card", name: "Debit Card", icon: CreditCard, description: "Pay using debit card" },
    { id: "Net Banking", name: "Net Banking", icon: Building2, description: "Pay using net banking" },
    { id: "Offline Payment", name: "Offline Payment", icon: Building2, description: "Pay at campus" },
  ];

  if (paymentSuccess) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h3>
          <p className="text-green-600">Your application fee has been successfully processed.</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Receipt</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Receipt Number</span>
              <span className="font-medium">REC{Date.now()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-medium">TXN{Date.now()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-medium text-green-600">₹{applicationFee}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">{selectedMethod}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Payment Date</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <button className="w-full mt-4 btn-secondary flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
        </div>

        <div className="flex justify-between">
          <button onClick={onPrevious} className="btn-secondary">
            Previous
          </button>
          <button onClick={handleNext} className="btn-primary">
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Application Fee Display */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary-900">Application Fee</h3>
            <p className="text-primary-600 text-sm">Non-refundable application processing fee</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary-700">₹{applicationFee}</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedMethod === method.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedMethod === method.id ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-600"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onPrevious} className="btn-secondary">
          Previous
        </button>
        <div className="flex gap-3">
          <button onClick={onSave} className="btn-secondary">
            Save Draft
          </button>
          <button
            onClick={handlePayment}
            disabled={!selectedMethod || processing}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay ₹{applicationFee}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
