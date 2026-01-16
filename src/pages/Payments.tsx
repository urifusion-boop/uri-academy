import { AlertCircle, Shield, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { StudentProfile } from '../types/schema';

export function Payments() {
  const [loading, setLoading] = useState(false);
  const { profile } = useOutletContext<{ profile: StudentProfile | null }>();
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'deposit'>('full');
  const SELAR_LINK = 'https://selar.com/j736831367';

  const payments = profile?.payments || [];
  const paidAmount = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const isStudent = profile?.user?.role === 'STUDENT';

  // If user is a STUDENT (or has paid something) but not fully paid, they might be on installment
  // Installment plan total is 35k. Full plan is 30k.
  // If they paid 20k (deposit), they owe 15k.
  // If they paid 30k, they are done (Full plan).
  // If they paid 35k, they are done (Installment plan).

  // Logic:
  // If paidAmount >= 30000 -> Fully Paid (Assume 30k is sufficient for full access, or check specific plan if stored)
  // If paidAmount >= 20000 && paidAmount < 30000 -> Deposit Paid. Balance 15k.

  const isDepositPaid = paidAmount >= 20000 && paidAmount < 30000;
  // If user is a STUDENT and hasn't paid a deposit (or paid fully), assume they are fully paid (e.g. scholarship/manual)
  const isFullyPaid = paidAmount >= 30000 || (isStudent && !isDepositPaid);
  const balanceAmount = 15000; // Fixed balance for installment

  // Determine what to show
  // If NOT Student (Applicant) -> Show Plans (Full 30k / Deposit 20k)
  // If Student AND Fully Paid -> Show "Paid" State
  // If Student AND Deposit Paid -> Show "Balance" State (Pay 15k)

  const showPaymentForm = !isStudent && paidAmount < 20000;
  // Show balance form if deposit is paid, regardless of role (in case role update is delayed)
  const showBalanceForm = isDepositPaid;
  // Show fully paid if condition met, regardless of role
  const showFullyPaid = isFullyPaid;

  // Amount to pay for current action
  const amountToPay = showBalanceForm
    ? balanceAmount
    : paymentPlan === 'full'
    ? 30000
    : 20000;

  // Plan string for API
  // If paying balance, we might need a specific plan flag or just pass amount.
  // Backend likely handles amount -> update balance.
  // We'll pass 'balance' if that's supported, or just let amount dictate it if backend logic supports generic payments.
  // For now, let's stick to the plans we have or assume 'installment_balance' if needed.
  // Based on previous instructions, we only had 'full' and 'deposit'.
  // I will assume for balance payment we can reuse 'deposit' or just rely on amount.
  // Let's pass 'balance' as plan if it's a balance payment, and ensure API handles it or treat as ad-hoc.
  // Or better, just pass amount and let backend figure it out, but API requires plan in frontend logic usually.
  // Let's use 'balance' and hope backend handles it, or I'll update API to be optional.

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Temporarily redirect to Selar checkout
      window.location.href = SELAR_LINK;
    } catch (error) {
      console.error('Payment redirect failed', error);
      alert('Payment redirect failed. Please try again.');
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments & Billing</h1>
        <p className="text-gray-600 mt-1">
          Manage your tuition payments and view transaction history.
        </p>
      </div>

      {/* Status Alerts */}
      {!isStudent && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800">Payment Required</h4>
            <p className="text-sm text-amber-700 mt-1">
              You are currently an APPLICANT. Please pay the tuition fee to
              become a STUDENT and unlock all course materials.
            </p>
          </div>
        </div>
      )}

      {showFullyPaid && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-800">Tuition Fully Paid</h4>
            <p className="text-sm text-green-700 mt-1">
              You have completed your tuition payments. You have full access to
              the course.
            </p>
          </div>
        </div>
      )}

      {showBalanceForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800">Payment Plan Active</h4>
            <p className="text-sm text-blue-700 mt-1">
              You have paid the initial deposit. Please clear the remaining
              balance to complete your tuition.
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Payment Actions or History Summary */}
        <div className="space-y-6">
          {/* 1. Payment Form (Initial) */}
          {showPaymentForm && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Select Payment Plan
              </h3>

              <div className="space-y-4 mb-6">
                <div
                  onClick={() => setPaymentPlan('full')}
                  className={`cursor-pointer border rounded-xl p-4 transition-all ${
                    paymentPlan === 'full'
                      ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                      : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">
                      Full Payment
                    </span>
                    <span className="font-bold text-brand-600">₦30,000</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Best value. One-time payment for full access.
                  </p>
                </div>

                <div
                  onClick={() => setPaymentPlan('deposit')}
                  className={`cursor-pointer border rounded-xl p-4 transition-all ${
                    paymentPlan === 'deposit'
                      ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                      : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">
                      Installment Plan
                    </span>
                    <span className="font-bold text-brand-600">₦20,000</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Pay deposit now, balance of ₦15,000 due later. Total:
                    ₦35,000.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center gap-2"
              >
                {loading
                  ? 'Initializing Payment...'
                  : `Pay ₦${amountToPay.toLocaleString()}`}
              </button>
            </div>
          )}

          {/* 2. Balance Payment Form */}
          {showBalanceForm && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Complete Your Payment
              </h3>

              <div className="p-4 bg-gray-50 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Outstanding Balance</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₦{balanceAmount.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Due for the Installment Plan (Total ₦35,000)
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center gap-2"
              >
                {loading
                  ? 'Initializing Payment...'
                  : `Pay Balance ₦${balanceAmount.toLocaleString()}`}
              </button>
            </div>
          )}

          {/* 3. Fully Paid View (Empty or Celebration) */}
          {showFullyPaid && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                All Caught Up!
              </h3>
              <p className="text-gray-600">
                You have no pending payments. Thank you for investing in your
                education.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Secure Badge */}
        <div className="space-y-6">
          {paidAmount > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Payment Summary
              </h3>
              <div className="space-y-3 border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Paid</span>
                  <span className="font-medium text-green-600">
                    ₦{paidAmount.toLocaleString()}
                  </span>
                </div>

                {showBalanceForm && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pending Balance</span>
                    <span className="font-medium text-red-600">
                      ₦{balanceAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Transaction History */}
              {payments.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Recent Transactions
                  </h4>
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment.id || payment.reference}
                        className="flex justify-between items-center text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.amount >= 30000
                              ? 'Full Payment'
                              : payment.amount >= 20000
                              ? 'Deposit'
                              : 'Balance Payment'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="font-mono text-gray-600">
                          ₦{payment.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-2">
              Secure Payment
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              Your payment is processed securely via Selar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
