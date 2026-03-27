'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

import { useState } from 'react';
import { api } from '@/services/api';
import type { User } from '@/types/schema';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/handleApiError';

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

export default function Login() {
  const router = useRouter();
  const { addToast } = useToast();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = (formData.get('email') as string).trim();
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
          setAuth(token, user);
          addToast('Successfully logged in', 'success');

          // Redirect based on role
          // Handle case-insensitive role check
          const role = user.role?.toUpperCase();
          if (role === 'ADMIN') {
            router.push('/admin');
          } else if (role === 'APPLICANT') {
            router.push('/student/payments');
          } else {
            router.push('/student');
          }
        } else {
          // Fallback if user object is missing but token exists
          router.push('/student');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login failed:', err);
      addToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="mt-1 text-sm text-gray-500">
          Sign in to continue your learning journey.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder:text-gray-400"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-brand-600 hover:text-brand-500 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="block w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder:text-gray-400"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? 'Signing in...' : 'Sign in'}
          {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
          Register now
        </Link>
      </p>
    </div>
  );
}
