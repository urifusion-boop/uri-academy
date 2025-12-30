import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { AdminTask } from '../services/api';
import type { StudentProfile } from '../types/schema';
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminHome() {
  const getInitials = (name?: string) => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    const first = parts[0];
    if (first.length >= 2) return (first[0] + first[1]).toUpperCase();
    return first[0].toUpperCase();
  };
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCohorts: 0,
    completionRate: '0%',
    revenue: '₦0',
  });
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [recentStudents, setRecentStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, tasksData, studentsData] = await Promise.all([
          api.getAdminStats(),
          api.getPendingTasks(),
          api.getStudents().catch(() => []),
        ]);

        setStats(statsData);
        setTasks(Array.isArray(tasksData) ? tasksData : []);
        // Sort students by join date if possible, otherwise just take first 5
        setRecentStudents(
          Array.isArray(studentsData) ? studentsData.slice(0, 5) : []
        );
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Students</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {stats.totalStudents}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Active Cohorts</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {stats.activeCohorts}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +5%
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Completion Rate</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {stats.completionRate}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +18%
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {stats.revenue}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Students */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Students</h2>
            <Link
              to="/admin/students"
              className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentStudents.length > 0 ? (
              recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                    {student.user?.initials || getInitials(student.user?.name)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">
                      {student.user?.name || 'Unknown User'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {student.user?.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {student.studentIdCode}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Progress: {student.progress}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No recent students found.
              </div>
            )}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Pending Tasks</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-3"
              >
                <div
                  className={`mt-0.5 ${
                    task.completed ? 'text-green-500' : 'text-amber-500'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      task.completed
                        ? 'text-gray-500 line-through'
                        : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {task.completed ? 'Completed' : 'Due Soon'}
                  </p>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No pending tasks.
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button className="w-full py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              View All Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
