'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
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
          </nav>
        </div>
      )}
    </header>
  );
}
