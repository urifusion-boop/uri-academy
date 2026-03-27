'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LogOut,
  Menu,
  X,
  UserCog,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';
import type { User } from '@/types/schema';

const navItems = [
  { label: 'Overview', href: '/admin' },
  { label: 'Students', href: '/admin/students' },
  { label: 'Cohorts', href: '/admin/cohorts' },
  { label: 'Assignments', href: '/admin/assignments' },
  { label: 'Content', href: '/admin/content' },
  { label: 'Submissions', href: '/admin/submissions' },
  { label: 'Certificates', href: '/admin/certificates' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setAuthChecked(true);
    const fetchUser = async () => {
      try {
        const userData = await api.users.getMe();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to fetch admin user:', error);
      }
    };
    fetchUser();
  }, [router]);

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

  const initials = user?.initials || (user?.name
    ? user.name.trim().split(/\s+/).map((p) => p[0]).join('').toUpperCase().slice(0, 2)
    : null);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Nav Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-white border-b border-gray-100 shadow-sm">
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/admin" className="flex items-center shrink-0">
            <Image
              src="/assets/image.png"
              alt="URI Academy"
              width={120}
              height={120}
              className="h-20 w-auto object-contain"
              priority
            />
          </Link>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
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

          {/* Right: Admin info + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-xs">
                {initials || <UserCog className="w-4 h-4" />}
              </div>
              <span className="text-sm font-medium text-gray-900 max-w-[120px] truncate">
                {user?.name || 'Admin User'}
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
              {navItems.map((item) => {
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
                    {initials || <UserCog className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'Admin User'}
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
      <main className="pt-24">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
