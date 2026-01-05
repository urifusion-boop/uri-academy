import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Phone,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useState } from 'react';
import { api } from '../services/api';
import type { User } from '../types/schema';
import { useToast } from '../context/ToastContext';

interface AuthResponse {
  token?: string;
  accessToken?: string;
  data?: {
    token?: string;
    user?: User;
  };
  user?: User;
  success?: boolean;
  id?: string;
}

export function Register() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;

    try {
      const response = (await api.auth.register({
        name,
        email,
        phone,
        password,
      })) as AuthResponse;

      const token =
        response.token || response.accessToken || response.data?.token;

      if (token) {
        localStorage.setItem('token', token);
        const user = response.user || response.data?.user;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        addToast('Account created successfully', 'success');
        navigate('/student/payments');
      } else {
        // Some APIs might not return token on register, but just success
        // In that case, we might want to redirect to login
        if (response.success || response.id) {
          addToast('Account created successfully. Please login.', 'success');
          navigate('/login');
        } else {
          throw new Error('Registration failed. Please try again.');
        }
      }
    } catch (err: unknown) {
      console.error('Registration failed:', err);
      let errorMessage = 'Failed to create account. Please try again.';
      if (err instanceof Error) {
        if (
          err.message.includes('409') ||
          err.message.toLowerCase().includes('exist')
        ) {
          errorMessage = 'Email already in use';
        } else {
          errorMessage = err.message;
        }
      }
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Start your journey to becoming a Digital Sales Expert.
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

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition-colors"
              placeholder="Create a password"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
        >
          {loading ? 'Creating account...' : 'Create Account'}
          {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
        </button>

        <div className="text-center">
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
      </form>
    </div>
  );
}
