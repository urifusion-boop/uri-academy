'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  LogOut,
  Menu,
  X,
  Loader2,
} from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';
import type { StudentProfile } from '@/types/schema';
import Image from 'next/image';
import { PaymentSuccessModal } from '@/components/PaymentSuccessModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const academicItems = [
  { label: 'Dashboard', href: '/student' },
  { label: 'Curriculum', href: '/student/curriculum' },
  { label: 'Assignments', href: '/student/assignments' },
  { label: 'Grades', href: '/student/grades' },
  { label: 'Attendance', href: '/student/attendance' },
  { label: 'Capstone', href: '/student/capstone' },
  { label: 'Certificate', href: '/student/certificate' },
];

const accountItems = [
  { label: 'Payments', href: '/student/payments' },
  { label: 'Settings', href: '/student/settings' },
];

const allNavItems = [...academicItems, ...accountItems];

function StudentLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setAuthChecked(true);
  }, [router]);

  const fetchProfile = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));
      const data = await api.getCurrentUserProfile();
      setProfile(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Failed to load profile');
    }
  };

  useEffect(() => {
    if (authChecked) fetchProfile();
  }, [authChecked]);

  useEffect(() => {
    const reference = searchParams?.get('reference');

    if (!reference || verifying || showSuccessModal) return;

    const handleVerification = async (ref: string) => {
      setVerifying(true);
      try {
        const response = await api.payments.verify(ref);
        if (response.status === 'PAID' && response.tokens) {
          localStorage.setItem('token', response.tokens.accessToken);
          localStorage.setItem('refreshToken', response.tokens.refreshToken);

          const params = new URLSearchParams(window.location.search);
          params.delete('reference');
          router.replace(`${pathname}?${params.toString()}`);

          setShowSuccessModal(true);

          try {
            await fetchProfile();
          } catch (e) {
            console.error('Failed to refresh profile after payment', e);
          }
        } else {
          alert(
            'Payment verification failed or pending. Please contact support if you have been debited.'
          );
        }
      } catch (error) {
        console.error('Verification error', error);
        alert('Payment verification failed. Please try again.');
      } finally {
        setVerifying(false);
      }
    };

    handleVerification(reference);
  }, [searchParams, verifying, showSuccessModal, pathname, router]);

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_profile');
      router.push('/login');
    }
  };

  const isApplicant = profile?.user?.role === 'APPLICANT';

  const allowedPaths = ['/student/payments', '/student/settings'];
  const currentPath = pathname?.replace(/\/+$/, '');
  const isAllowedPath = allowedPaths.includes(currentPath || '');

  const canAccess = isAllowedPath || !isApplicant;

  useEffect(() => {
    if (profile?.user?.role === 'APPLICANT') {
      const checkRoleUpgrade = async () => {
        try {
          const updated = await api.users.getMe();
          if (updated.role !== 'APPLICANT') {
            window.location.reload();
          }
        } catch (e) {
          console.error('Role check failed', e);
        }
      };
      checkRoleUpgrade();
    }
  }, [profile?.user?.role]);

  // APPLICANT users only see Payments and Settings
  const visibleNavItems = isApplicant ? accountItems : allNavItems;

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-900">
          Verifying Payment...
        </h2>
        <p className="text-gray-500">
          Please wait while we confirm your transaction.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Top Nav Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-100 shadow-sm">
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/student" className="flex items-center shrink-0">
            <Image
              src="/assets/image.png"
              alt="Uri Academy"
              width={120}
              height={120}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: User info + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-xs">
                {profile?.user?.initials || '??'}
              </div>
              <span className="text-sm font-medium text-gray-900 max-w-[120px] truncate">
                {profile?.user?.name || (error ? 'Guest' : 'Loading...')}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 shadow-lg">
            <nav className="px-4 py-3 space-y-1">
              {visibleNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-gray-100 mt-2">
                <div className="flex items-center gap-2 px-3 py-2 mb-1">
                  <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-xs">
                    {profile?.user?.initials || '??'}
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {profile?.user?.name || (error ? 'Guest' : 'Loading...')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {canAccess ? (
              <ErrorBoundary>{children}</ErrorBoundary>
            ) : (
              <div className="max-w-2xl mx-auto text-center bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Access Locked
                </h2>
                <p className="text-gray-600 mb-6">
                  You are currently an APPLICANT. Please pay the tuition fee to
                  become a STUDENT and unlock all course materials.
                </p>

                <div className="flex justify-center gap-3">
                  <Link
                    href="/student/payments"
                    className="btn-primary px-6 py-3 rounded-lg font-bold"
                  >
                    Go to Payments
                  </Link>
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-white text-gray-700 font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Need Help?
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
      </div>
    }>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </Suspense>
  );
}
