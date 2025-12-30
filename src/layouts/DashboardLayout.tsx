import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  CalendarCheck,
  Award,
  GraduationCap,
  CreditCard,
  LogOut,
  Menu,
  Bell,
  Search,
  Settings,
  HelpCircle,
  BarChart3,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { api } from '../services/api';
import type { StudentProfile } from '../types/schema';

const academicItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/student' },
  { icon: BookOpen, label: 'Curriculum', href: '/student/curriculum' },
  { icon: FileText, label: 'Assignments', href: '/student/assignments' },
  { icon: BarChart3, label: 'My Grades', href: '/student/grades' },
  { icon: CalendarCheck, label: 'Attendance', href: '/student/attendance' },
  { icon: Award, label: 'Capstone', href: '/student/capstone' },
  { icon: GraduationCap, label: 'Certificate', href: '/student/certificate' },
];

const accountItems = [
  { icon: CreditCard, label: 'Payments', href: '/student/payments' },
  { icon: Settings, label: 'Settings', href: '/student/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/contact' },
];

const allItems = [...academicItems, ...accountItems];

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_profile');
      navigate('/login');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      // Debounce or avoid immediate double call if needed, but for now just swallow 429s gracefully
      try {
        // Add a small random delay to prevent thundering herd if multiple components mount at once
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 500)
        );
        const data = await api.getCurrentUserProfile();
        setProfile(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setError('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const renderSidebarItem = (item: (typeof academicItems)[0]) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        key={item.href}
        to={item.href}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative',
          isActive
            ? 'bg-brand-50 text-brand-700 shadow-sm'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        )}
        onClick={() => setIsSidebarOpen(false)}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-600 rounded-r-full"></div>
        )}
        <item.icon
          className={cn(
            'w-5 h-5 transition-colors',
            isActive
              ? 'text-brand-600'
              : 'text-gray-400 group-hover:text-gray-600'
          )}
        />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col h-full shrink-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="h-20 flex items-center px-8 border-b border-gray-50">
          <Link to="/student" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-200 group-hover:scale-105 transition-transform">
              U
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Uri<span className="text-brand-600">Academy</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-8 overflow-y-auto">
          <div>
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Academic
            </p>
            <div className="space-y-1">
              {academicItems.map(renderSidebarItem)}
            </div>
          </div>

          <div>
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Account
            </p>
            <div className="space-y-1">
              {accountItems.map(renderSidebarItem)}
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-gray-50">
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-700 font-bold border border-gray-100 shadow-sm">
                {profile?.user?.initials || '??'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {profile?.user?.name || (error ? 'Guest' : 'Loading...')}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Student Account
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div
                className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${profile?.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-right">
              {profile?.progress || 0}% Completed
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50 md:pl-72">
        <header className="h-20 bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 hidden md:block">
              {allItems.find((i) => i.href === location.pathname)?.label ||
                'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-brand-500 w-64 transition-all"
              />
            </div>

            <button
              type="button"
              className="relative p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  {profile?.user?.name || (error ? 'Guest' : 'Loading...')}
                </p>
                <p className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-0.5 rounded-full inline-block">
                  {profile?.cohort?.name ||
                    (error ? 'No Cohort' : 'Loading...')}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
