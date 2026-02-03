import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [status, setStatus] = useState<
    'verifying' | 'success' | 'error' | 'setting_password'
  >('verifying');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference =
        searchParams.get('reference') || searchParams.get('trxref');

      if (!reference) {
        // Only show error if we're not already successful
        if (status !== 'success' && status !== 'setting_password') {
          setStatus('error');
        }
        return;
      }

      // If we are already in setting_password or success state, don't re-verify
      if (status === 'setting_password' || status === 'success') return;

      try {
        const response = await api.payments.verify(reference);
        if (response.status === 'success' || response.status === 'PAID') {
          // Store tokens if provided
          if (response.tokens) {
            localStorage.setItem('token', response.tokens.accessToken);
            localStorage.setItem('refreshToken', response.tokens.refreshToken);
          }

          // Check the source to determine if this is a new registration
          const source = searchParams.get('source');

          if (source === 'register' && response.tokens) {
            // New registration flow - need to set password
            setStatus('setting_password');
          } else {
            // Existing user payment or already has password
            setStatus('success');
            addToast('Payment verified successfully!', 'success');
            setTimeout(() => {
              navigate('/student');
            }, 2000);
          }
        } else {
          console.error('Payment verification failed:', response);
          setStatus('error');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
      }
    };

    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, navigate, addToast]); // Removed status from dependency to avoid loop

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Set the initial password for new user after payment verification
      await api.users.setInitialPassword({
        password,
      });

      addToast('Account created successfully!', 'success');

      // Clear pending registration data
      localStorage.removeItem('pendingRegistration');

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/student');
      }, 1000);
    } catch (err) {
      console.error('Failed to set password:', err);

      // Try updatePassword as fallback for edge cases
      try {
        await api.users.updatePassword({
          currentPassword: null,
          newPassword: password,
        });
        addToast('Account created successfully!', 'success');
        localStorage.removeItem('pendingRegistration');
        setTimeout(() => {
          navigate('/student');
        }, 1000);
      } catch (fallbackErr) {
        console.error('Fallback password update also failed:', fallbackErr);
        addToast(
          'Payment successful, but password setup failed. Please contact support or try "Forgot Password".',
          'error',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-16 h-16 text-brand-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment...
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your registration.
            </p>
          </>
        )}

        {status === 'setting_password' && (
          <div className="text-left">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Please set a password to complete your account setup.
            </p>

            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Create Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 transition-all hover:-translate-y-0.5"
              >
                {loading ? (
                  'Setting Password...'
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Welcome aboard! Redirecting you to your dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. If you have been debited, please
              contact support.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors duration-200"
            >
              Contact Support
            </button>
          </>
        )}
      </div>
    </div>
  );
}
