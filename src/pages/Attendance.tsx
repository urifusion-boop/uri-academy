import { useEffect, useState } from 'react';
import { Check, X, Minus } from 'lucide-react';
import { api } from '../services/api';
import type { AttendanceLog } from '../types/schema';
import { formatDate } from '../utils/date';

export function Attendance() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await api.getCurrentUserProfile();
        if (profile?.id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any = await api.attendance.getLogs({
            studentId: profile.id,
          });
          // Handle potential paginated response or direct array
          const items = Array.isArray(data)
            ? data
            : data && Array.isArray(data.items)
            ? data.items
            : [];
          setLogs(items);
        }
      } catch (error) {
        console.error('Failed to fetch attendance logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading attendance records...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Attendance Record</h1>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.session?.topic || 'Unknown Session'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.session?.date
                      ? formatDate(log.session.date)
                      : 'No date'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.status === 'PRESENT' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="w-3 h-3" /> Present
                      </span>
                    )}
                    {log.status === 'ABSENT' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <X className="w-3 h-3" /> Absent
                      </span>
                    )}
                    {log.status === 'LATE' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Minus className="w-3 h-3" /> Late
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
