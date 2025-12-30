import { Link, Outlet } from "react-router-dom";
import { Menu, X, Twitter, Linkedin, Instagram } from "lucide-react";
import { useState, useEffect } from "react";

export function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Header */}
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled || isMenuOpen ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-200 group-hover:scale-105 transition-transform">
              U
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Uri<span className="text-brand-600">Academy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Home</Link>
            <Link to="/program" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Program</Link>
            <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Pricing</Link>
            <div className="flex items-center gap-4 ml-6 pl-6 border-l border-gray-200">
              <Link to="/login" className="text-sm font-semibold text-gray-900 hover:text-brand-600 transition-colors">
                Log in
              </Link>
              <Link to="/register" className="btn-primary py-2.5 px-5 text-sm shadow-brand-200 hover:shadow-brand-300 hover:-translate-y-0.5">
                Register Now
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-brand-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b shadow-lg animate-fade-in">
            <nav className="flex flex-col p-4 gap-2">
              <Link to="/" className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg">Home</Link>
              <Link to="/program" className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg">Program</Link>
              <Link to="/pricing" className="p-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg">Pricing</Link>
              <div className="h-px bg-gray-100 my-2"></div>
              <Link to="/login" className="p-3 text-center font-semibold text-gray-900 hover:bg-gray-50 rounded-lg">
                Log in
              </Link>
              <Link to="/register" className="btn-primary w-full text-center">
                Register Now
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  U
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Uri<span className="text-brand-400">Academy</span>
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Empowering the next generation of digital sales professionals with AI-driven skills and real-world experience.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Program</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><Link to="/program" className="hover:text-brand-400 transition-colors">Curriculum</Link></li>
                <li><Link to="/pricing" className="hover:text-brand-400 transition-colors">Tuition & Dates</Link></li>
                <li><Link to="/faq" className="hover:text-brand-400 transition-colors">FAQs</Link></li>
                <li><Link to="/register" className="hover:text-brand-400 transition-colors">Apply Now</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-brand-400 transition-colors">Careers</Link></li>
                <li><Link to="/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
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
            <p>© {new Date().getFullYear()} Uri Sales Academy. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/terms" className="hover:text-gray-300">Terms</Link>
              <Link to="/privacy" className="hover:text-gray-300">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
