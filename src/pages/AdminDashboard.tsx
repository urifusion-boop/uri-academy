import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { StudentProfile, Submission } from '../types/schema';
import { formatDate } from '../utils/date';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCohorts: 0,
    completionRate: '0%',
    revenue: '₦0',
  });
  const [recentStudents, setRecentStudents] = useState<StudentProfile[]>([]);
  const [pendingTasks, setPendingTasks] = useState<
    { id: string; title: string; completed: boolean; link?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, studentsData, submissionsData] = await Promise.all([
          api.getAdminStats(),
          api.getStudents(),
          api.assignments.getAllSubmissions().catch(() => []),
        ]);

        setStats(statsData);
        // Get last 4 students
        setRecentStudents(studentsData.slice(-4).reverse());

        // Generate grading tasks from pending submissions
        const gradingTasks = submissionsData
          .filter((s: Submission) => s.status === 'PENDING')
          .map((s: Submission) => ({
            id: s.id,
            title: `Grade ${s.student?.user?.name || 'Student'}'s ${
              s.assignment?.title || 'Assignment'
            }`,
            completed: false,
            link: '/admin/submissions',
          }))
          .slice(0, 5);

        setPendingTasks(gradingTasks);
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-600">Manage your cohorts and students.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Students', value: stats.totalStudents },
          { label: 'Active Cohorts', value: stats.activeCohorts },
          { label: 'Completion Rate', value: stats.completionRate },
          { label: 'Revenue (Mo)', value: stats.revenue },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm font-medium text-gray-500 mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-bold mb-4">Recent Registrations</h2>
          <div className="space-y-4">
            {recentStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold">
                    {student.user?.initials}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{student.user?.name}</p>
                    <p className="text-xs text-gray-500">
                      Registered {formatDate(student.user?.createdAt || '')}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  Paid
                </span>
              </div>
            ))}
            {recentStudents.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No recent registrations
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-bold mb-4">Pending Tasks</h2>
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked={task.completed}
                  className="rounded text-brand-600 focus:ring-brand-500"
                  aria-label={`Mark task "${task.title}" as complete`}
                  disabled
                />
                {task.link ? (
                  <Link
                    to={task.link}
                    className={`text-sm hover:text-brand-600 ${
                      task.completed
                        ? 'text-gray-400 line-through'
                        : 'text-gray-700'
                    }`}
                  >
                    {task.title}
                  </Link>
                ) : (
                  <span
                    className={`text-sm ${
                      task.completed
                        ? 'text-gray-400 line-through'
                        : 'text-gray-700'
                    }`}
                  >
                    {task.title}
                  </span>
                )}
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No pending grading tasks
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
