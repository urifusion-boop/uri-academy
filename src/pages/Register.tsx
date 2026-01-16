import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export function Register() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const SELAR_LINK = 'https://selar.com/j736831367';

  const handleContinue = () => {
    setLoading(true);
    try {
      // Redirect directly to Selar checkout
      window.location.href = SELAR_LINK;
    } catch (err: unknown) {
      console.error('Payment redirect failed:', err);
      addToast('Failed to redirect to payment. Please try again.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Register</h2>
        <p className="mt-2 text-sm text-gray-600">
          Join our academy with a one-time payment.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border-2 border-brand-500 bg-brand-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg text-gray-900">
              Full Payment
            </span>
            <CheckCircle className="w-6 h-6 text-brand-600" />
          </div>
          <div className="text-3xl font-bold text-brand-900 mb-2">
            ₦30,000
          </div>
          <p className="text-sm text-gray-600">
            One-time payment for full access to all course materials and
            mentorship.
          </p>
        </div>

        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full mt-6 flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
        >
          {loading ? 'Redirecting...' : 'Continue with Full Payment'}
          {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
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
