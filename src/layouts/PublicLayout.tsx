import { Link, Outlet } from 'react-router-dom';
import { Menu, X, Linkedin, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../assets/image.png';

export function PublicLayout() {
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
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Header */}
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled || isMenuOpen
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 h-32 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="Uri Academy"
              className="h-28 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/program"
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
            >
              About
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/business"
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
            >
              For Businesses
            </Link>
            <Link
              to="/graduates"
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
            >
              Graduates
            </Link>
            <div className="flex items-center gap-4 ml-6 pl-6 border-l border-gray-200">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-900 hover:text-brand-600 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
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
          <div className="md:hidden absolute top-32 left-0 w-full bg-white border-b shadow-lg animate-fade-in">
            <nav className="flex flex-col p-4 gap-2">
              <Link
                to="/"
                className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
              >
                Home
              </Link>
              <Link
                to="/program"
                className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
              >
                About
              </Link>
              <Link
                to="/pricing"
                className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
              >
                Contact
              </Link>
              <Link
                to="/business"
                className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
              >
                For Businesses
              </Link>
              <Link
                to="/graduates"
                className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
              >
                Graduates
              </Link>
              <div className="h-px bg-gray-100 my-2"></div>
              <Link
                to="/login"
                className="p-3 text-center font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                Log in
              </Link>
              <Link to="/register" className="btn-primary w-full text-center">
                Apply Now
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-32">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <img
                  src={logo}
                  alt="Uri Academy"
                  className="h-40 w-auto object-contain"
                />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                The Human Edge in the Age of AI.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.tiktok.com/@uri.sales.academy?_r=1&_t=ZS-92qpGJM1grR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-all"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/uri.sales.academy?igsh=MXZrZjV2azlyMjU1bQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Explore</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li>
                  <Link
                    to="/program"
                    className="hover:text-brand-400 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business"
                    className="hover:text-brand-400 transition-colors"
                  >
                    For Businesses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/graduates"
                    className="hover:text-brand-400 transition-colors"
                  >
                    Graduates
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li>
                  <a
                    href="/#what-is-uri"
                    className="hover:text-brand-400 transition-colors"
                  >
                    What is Uri?
                  </a>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-brand-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-brand-400 transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-brand-400 transition-colors"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to our newsletter for sales tips and program updates.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-none rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-brand-500 w-full"
                />
                <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-500 transition-colors">
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} Uri Academy. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/terms" className="hover:text-gray-300">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-gray-300">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
