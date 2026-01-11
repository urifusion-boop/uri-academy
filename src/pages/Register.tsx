import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Phone,
  ArrowRight,
  CreditCard,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function Register() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'plan' | 'details'>('plan');
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'deposit'>('full');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    const amount = paymentPlan === 'full' ? 30000 : 20000;
    const callbackUrl = `${window.location.origin}/payment/verify?source=register`;

    // Save minimal user info to localStorage as a fallback
    localStorage.setItem(
      'user',
      JSON.stringify({
        name,
        email,
        phoneNumber: phone,
        role: 'STUDENT',
        initials: name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
        id: 'pending-id',
      })
    );

    try {
      // Initialize Public Payment
      const response = await api.payments.initializePublic({
        name,
        email,
        phoneNumber: phone,
        amount,
        plan: paymentPlan,
        callbackUrl,
      });

      const { authorizationUrl } = response;

      if (!authorizationUrl) {
        throw new Error(
          'Payment initialization failed: No authorization URL returned'
        );
      }

      // Redirect to Paystack
      window.location.href = authorizationUrl;
    } catch (err: unknown) {
      console.error('Payment initialization failed:', err);
      let errorMessage = 'Failed to initialize payment. Please try again.';
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage =
            'Connection timed out. The server took too long to respond.';
        } else if (
          err.message.includes('409') ||
          err.message.toLowerCase().includes('exist')
        ) {
          errorMessage = 'Email already in use. Please login instead.';
        } else {
          errorMessage = err.message;
        }
      }
      addToast(errorMessage, 'error');
      setLoading(false);
    }
  };

  if (step === 'plan') {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Select Your Plan</h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose a payment option to start your journey.
          </p>
        </div>

        <div className="space-y-4">
          <div
            onClick={() => setPaymentPlan('full')}
            className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${
              paymentPlan === 'full'
                ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg text-gray-900">
                Full Payment
              </span>
              {paymentPlan === 'full' && (
                <CheckCircle className="w-6 h-6 text-brand-600" />
              )}
            </div>
            <div className="text-3xl font-bold text-brand-900 mb-2">
              ₦30,000
            </div>
            <p className="text-sm text-gray-600">
              One-time payment for full access to all course materials and
              mentorship.
            </p>
          </div>

          <div
            onClick={() => setPaymentPlan('deposit')}
            className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${
              paymentPlan === 'deposit'
                ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg text-gray-900">Deposit</span>
              {paymentPlan === 'deposit' && (
                <CheckCircle className="w-6 h-6 text-brand-600" />
              )}
            </div>
            <div className="text-3xl font-bold text-brand-900 mb-2">
              ₦20,000
            </div>
            <p className="text-sm text-gray-600">
              Secure your spot now and pay the balance later.
            </p>
          </div>

          <button
            onClick={() => setStep('details')}
            className="w-full mt-6 flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all hover:-translate-y-0.5"
          >
            Continue with {paymentPlan === 'full' ? 'Full Payment' : 'Deposit'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-brand-600 hover:text-brand-500 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <button
          onClick={() => setStep('plan')}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-4 transition-colors"
        >
          <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
          Back to Plans
        </button>
        <h2 className="text-3xl font-bold text-gray-900">
          Contact Information
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your details to proceed to payment for the{' '}
          <span className="font-bold text-brand-600">
            {paymentPlan === 'full' ? 'Full Payment' : 'Deposit'}
          </span>{' '}
          plan.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleRegister}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition-colors"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition-colors"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number (WhatsApp)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition-colors"
              placeholder="+234..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
        >
          {loading ? (
            'Processing...'
          ) : (
            <>
              Proceed to Payment (₦
              {paymentPlan === 'full' ? '30,000' : '20,000'})
            </>
          )}
          {!loading && <CreditCard className="ml-2 w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
