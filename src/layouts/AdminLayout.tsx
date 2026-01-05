import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Layers,
  ClipboardList,
  UploadCloud,
  FileCheck,
  Award,
  LogOut,
  Menu,
  UserCog,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { api } from '../services/api';
import logo from '../assets/image.png';
import type { User } from '../types/schema';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Admin Overview', href: '/admin' },
  { icon: Users, label: 'Students', href: '/admin/students' },
  { icon: Layers, label: 'Cohorts', href: '/admin/cohorts' },
  { icon: ClipboardList, label: 'Assignments', href: '/admin/assignments' },
  { icon: UploadCloud, label: 'Content', href: '/admin/content' },
  { icon: FileCheck, label: 'Submissions', href: '/admin/submissions' },
  { icon: Award, label: 'Certificates', href: '/admin/certificates' },
];

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

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
          <Link to="/admin" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Uri Academy"
              className="w-10 h-10 rounded-xl shadow-lg shadow-brand-200 group-hover:scale-105 transition-transform object-contain bg-white"
            />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Uri<span className="text-brand-600">Admin</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Management
          </p>
          {sidebarItems.map((item) => {
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
          })}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-700 font-bold border border-gray-100 shadow-sm">
                {user?.initials || <UserCog className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'admin@uri.com'}
                </p>
              </div>
            </div>
          </div>

          <button
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
        <header className="h-20 bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
          <button
            className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">
                Administrator Panel
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
