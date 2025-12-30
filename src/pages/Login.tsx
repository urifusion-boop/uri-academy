import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { api } from '../services/api';
import type { User } from '../types/schema';
import { useToast } from '../context/ToastContext';

interface AuthResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  data?: {
    token?: string;
    refreshToken?: string;
    user?: User;
  };
  user?: User;
  success?: boolean;
  id?: string;
}

export function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = (await api.auth.login({
        email,
        password,
      })) as AuthResponse;
      console.log('Login Response:', response); // Debugging

      const token =
        response.token || response.accessToken || response.data?.token;

      // Check for refresh token in various possible locations
      const refreshToken = response.refreshToken || response.data?.refreshToken;
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      if (token) {
        localStorage.setItem('token', token);
        let user = response.user || response.data?.user;

        // If user is not in the response, try to fetch it
        if (!user) {
          try {
            user = await api.users.getMe();
          } catch (fetchError) {
            console.error('Failed to fetch user details:', fetchError);
          }
        }

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          addToast('Successfully logged in', 'success');

          // Redirect based on role
          // Handle case-insensitive role check
          const role = user.role?.toUpperCase();
          if (role === 'ADMIN') {
            navigate('/admin');
          } else {
            navigate('/student');
          }
        } else {
          // Fallback if user object is missing but token exists
          navigate('/student');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login failed:', err);
      let errorMessage = 'Failed to login';

      if (err instanceof Error) {
        // Map common errors to user-friendly messages
        if (
          err.message.includes('401') ||
          err.message.includes('403') ||
          err.message.toLowerCase().includes('invalid')
        ) {
          errorMessage = 'Invalid email or password';
        } else if (err.message.includes('404')) {
          errorMessage = 'Login service unavailable';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
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
        <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please enter your details to sign in.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition-colors"
              placeholder="Enter your email"
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
              type="password"
              autoComplete="current-password"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition-colors"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-600 cursor-pointer"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-brand-600 hover:text-brand-500 transition-colors"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
            {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-brand-600 hover:text-brand-500 transition-colors"
          >
            Register now
          </Link>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-xs text-center text-gray-400 uppercase tracking-wider mb-4">
          Quick Demo Access
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/student')}
            className="px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            Student Demo
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            Admin Demo
          </button>
        </div>
      </div>
    </div>
  );
}
