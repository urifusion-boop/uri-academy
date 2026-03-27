'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Read auth state from context (SSR-safe: context initialises from localStorage in useEffect)
  const { user, token, clearAuth } = useAuth();

  const isLoggedIn = !!token;

  // Derive initials: up to 2 letters from name
  const getInitials = (name?: string | null): string => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name);
  const dashboardHref = user?.role?.toUpperCase() === 'ADMIN' ? '/admin' : '/student';

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    clearAuth();
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled || isMenuOpen
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-gray-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/assets/image.png"
            alt="Uri Academy"
            width={100}
            height={64}
            className="h-16 w-auto object-contain group-hover:scale-105 transition-transform"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/program"
            className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/business"
            className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
          >
            For Businesses
          </Link>
          <Link
            href="/graduates"
            className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
          >
            Graduates
          </Link>

          <div className="flex items-center gap-4 ml-6 pl-6 border-l border-gray-200">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen ? 'true' : 'false'}
                >
                  <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold select-none">
                    {initials}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate capitalize">{user?.role?.toLowerCase()}</p>
                    </div>
                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-400" />
                      Go to Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-900 hover:text-brand-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="btn-primary py-2.5 px-5 text-sm shadow-brand-200 hover:shadow-brand-300 hover:-translate-y-0.5"
                >
                  Apply Now
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-gray-600 hover:text-brand-600 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b shadow-lg animate-fade-in">
          <nav className="flex flex-col p-4 gap-2">
            <Link
              href="/"
              className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/program"
              className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/business"
              className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              For Businesses
            </Link>
            <Link
              href="/graduates"
              className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Graduates
            </Link>
            <div className="h-px bg-gray-100 my-2"></div>

            {isLoggedIn ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
                <Link
                  href={dashboardHref}
                  className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => { setIsMenuOpen(false); handleSignOut(); }}
                  className="p-3 text-red-600 font-medium hover:bg-red-50 rounded-lg flex items-center gap-2 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="p-3 text-center font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="btn-primary w-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Apply Now
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
