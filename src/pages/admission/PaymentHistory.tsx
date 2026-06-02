import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Download, CreditCard, CheckCircle, Clock } from "lucide-react";
import type { PaymentRecord } from "../../types/admissionPortal";
import { getPaymentHistory } from "../../api/services/admissionPortalService";

export default function PaymentHistory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await getPaymentHistory();
      if (response.success) {
        setPayments(response.data || []);
      }
    } catch (error) {
      console.error("Error loading payments:", error);
      setPayments(getMockPayments());
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = (transactionId: string) => {
    // Implement receipt download
    console.log("Downloading receipt for:", transactionId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold mb-2">Payment History</h1>
          <p className="text-primary-200">View all your payment transactions</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">₹1,000</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">₹0</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Table */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Transaction History</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Transaction ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment Method</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.transaction_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{payment.transaction_id}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{payment.date}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{payment.description}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900">₹{payment.amount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{payment.payment_method}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === "success"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : payment.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {payment.status === "success" && (
                        <button
                          onClick={() => handleDownloadReceipt(payment.transaction_id)}
                          className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {payments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No payment transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// function getMockPayments(): PaymentRecord[] {
//   return [
//     {
//       transaction_id: "TXN20240115001",
//       date: "2024-01-15",
//       amount: 1000,
//       payment_method: "UPI",
//       status: "success",
//       receipt_url: "/receipts/TXN20240115001.pdf",
//       description: "Application Fee",
//     },
//   ];
// }
