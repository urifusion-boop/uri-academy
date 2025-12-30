import { CreditCard, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function Payments() {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setIsPaid(true);
    }, 1500);
  };

  if (isPaid) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-8">
          Thank you for your payment. You now have full access to the program.
        </p>
        <button className="btn-primary">
          View Receipt
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments & Billing</h1>
        <p className="text-gray-600 mt-1">Manage your subscription and payment methods.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-800">Payment Pending</h4>
          <p className="text-sm text-amber-700 mt-1">
            Please complete your payment to unlock all course materials and assignments.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                onClick={() => setPaymentMethod('card')}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                    : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50'
                }`}
              >
                <CreditCard
                  className={`w-8 h-8 ${
                    paymentMethod === 'card' ? 'text-brand-600' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-sm font-bold ${
                    paymentMethod === 'card' ? 'text-brand-900' : 'text-gray-600'
                  }`}
                >
                  Card Payment
                </span>
              </div>

              <div
                onClick={() => setPaymentMethod('bank')}
                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                    : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50'
                }`}
              >
                <Building2
                  className={`w-8 h-8 ${
                    paymentMethod === 'bank' ? 'text-brand-600' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-sm font-bold ${
                    paymentMethod === 'bank' ? 'text-brand-900' : 'text-gray-600'
                  }`}
                >
                  Bank Transfer
                </span>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input type="text" placeholder="123" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input type="text" placeholder="John Doe" className="input-field" />
                </div>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Name</span>
                  <span className="font-medium text-gray-900">Access Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number</span>
                  <span className="font-medium text-gray-900">0123456789</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Name</span>
                  <span className="font-medium text-gray-900">Uri Sales Academy</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Please include your student ID (STD-2025-001) in the transfer description.
                </p>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full mt-6 btn-primary"
            >
              {loading ? 'Processing...' : 'Pay ₦150,000'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Digital Sales Program</span>
                <span className="font-medium text-gray-900">₦150,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Registration Fee</span>
                <span className="font-medium text-gray-900">₦5,000</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₦155,000</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Your payment information is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
