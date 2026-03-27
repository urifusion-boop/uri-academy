'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '@/services/api';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = (formData.get('email') as string).trim();

    try {
      await api.auth.requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      console.error('Password reset request failed:', err);
      // Still show success to prevent user enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Check your email</h2>
          <p className="mt-3 text-sm text-gray-600 max-w-sm mx-auto">
            If an account exists for that email address, we've sent a password
            reset link. It expires in 1 hour.
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Forgot password?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
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

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send reset link'}
          {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
