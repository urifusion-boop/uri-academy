import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
} from 'lucide-react';
import { api } from '../services/api';
import type { StudentProfile, Cohort, User } from '../types/schema';
import { formatDate } from '../utils/date';
import { useToast } from '../context/ToastContext';

export function AdminStudents() {
  const { addToast } = useToast();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCohortId, setSelectedCohortId] = useState<string>('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    cohortId: '',
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await api.students.list({
          search: search || undefined,
          cohortId: selectedCohortId || undefined,
          page,
          pageSize,
        });
        type ListEnvelope<T> = { items?: T[]; total?: number };
        const envelope = response as ListEnvelope<User | StudentProfile>;
        const arrayResponse = response as Array<User | StudentProfile>;
        const items: Array<User | StudentProfile> = Array.isArray(arrayResponse)
          ? arrayResponse
          : Array.isArray(envelope.items)
          ? envelope.items!
          : [];
        const mapped: StudentProfile[] = items.map((item) => {
          if ('profile' in item) {
            const u = item as User;
            const p = u.profile || ({} as Partial<StudentProfile>);
            return {
              id: (p.id as string) || u.id,
              userId: u.id,
              user: u,
              cohortId: p.cohortId ?? null,
              cohort: p.cohort,
              progress: p.progress ?? 0,
              studentIdCode: p.studentIdCode ?? 'PENDING',
              submissions: p.submissions,
              grades: p.grades,
              attendanceLogs: p.attendanceLogs,
              payments: p.payments,
              certificates: p.certificates,
            };
          }
          return item as StudentProfile;
        });
        setStudents(mapped);
        setTotal(typeof envelope.total === 'number' ? envelope.total : null);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        addToast(
          'Failed to load students. Please check your connection or login again.',
          'error'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCohortId, page]);

  useEffect(() => {
    const loadCohorts = async () => {
      try {
        const list = await api.cohorts.list();
        setCohorts(Array.isArray(list) ? list : []);
      } catch {
        setCohorts([]);
      }
    };
    loadCohorts();
  }, []);

  const handleDelete = async (student: StudentProfile) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        // Use userId if available as backend likely expects User ID
        const idToDelete = student.userId || student.id;
        await api.students.delete(idToDelete);
        setStudents((prev) => prev.filter((s) => s.id !== student.id));
        addToast('Student deleted successfully', 'success');
      } catch (error) {
        console.error('Failed to delete student:', error);
        addToast('Failed to delete student. Please try again.', 'error');
      }
    }
  };

  const handleOpenAdd = () => {
    setSelectedStudent(null);
    setShowPassword(false);
    setForm({
      email: '',
      password: '',
      name: '',
      phoneNumber: '',
      cohortId: '',
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (student: StudentProfile) => {
    setSelectedStudent(student);
    setShowPassword(false);
    setForm({
      email: student.user?.email || '',
      password: '', // Password optional for edit
      name: student.user?.name || '',
      phoneNumber: student.user?.phoneNumber || '',
      cohortId: student.cohortId || '',
    });
    setIsAddOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.email || !form.name) {
      addToast('Email and Name are required', 'error');
      return;
    }
    if (!selectedStudent && !form.password) {
      addToast('Password is required for new students', 'error');
      return;
    }

    try {
      setCreating(true);

      if (selectedStudent) {
        // Update existing
        const updateData: Record<string, unknown> = {
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
          cohortId: form.cohortId || null,
        };
        if (form.password) {
          updateData.password = form.password;
        }

        // Use userId if available, else id
        const idToUpdate = selectedStudent.userId || selectedStudent.id;
        await api.students.update(idToUpdate, updateData);
        addToast('Student updated successfully', 'success');
      } else {
        // Create new
        await api.students.create({
          email: form.email,
          password: form.password,
          name: form.name,
          phoneNumber: form.phoneNumber,
          cohortId: form.cohortId || undefined,
        });
        addToast('Student created successfully', 'success');
      }

      // Refresh list
      // Trigger a re-fetch by toggling a dependency or calling logic directly
      // Here we just re-run the effect by clearing search or similar,
      // but ideally we extract the fetch logic.
      // For now, let's manually update the local state or reload.
      // Simple reload of data:
      setPage(1); // This triggers the effect
      setIsAddOpen(false);
    } catch (err) {
      console.error('Failed to save student:', err);
      addToast(
        selectedStudent
          ? 'Failed to update student'
          : 'Failed to create student',
        'error'
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500">
            Manage your students and track their progress.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex-1 sm:flex-none"
            onClick={() => {
              const rows = students.map((s) => [
                s.id,
                s.user?.name || '',
                s.user?.email || '',
                s.studentIdCode || '',
                s.cohort?.name || '',
              ]);
              const header = ['id', 'name', 'email', 'studentIdCode', 'cohort'];
              const csv = [header, ...rows]
                .map((r) =>
                  r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
                )
                .join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'students.csv';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors flex-1 sm:flex-none shadow-sm shadow-brand-200"
            onClick={handleOpenAdd}
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent focus:bg-white focus:border-brand-500 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <select
            aria-label="Filter by Cohort"
            title="Filter by Cohort"
            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 border-none focus:ring-0 cursor-pointer"
            value={selectedCohortId}
            onChange={(e) => {
              setSelectedCohortId(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Cohorts</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by Status"
            title="Filter by Status"
            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 border-none focus:ring-0 cursor-pointer"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cohort
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading students...
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                            {student.user?.initials}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {student.user?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-brand-50 text-brand-700">
                        {student.cohort?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-600">
                            {student.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-brand-600 h-1.5 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.cohort?.status === 'ACTIVE'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {student.cohort?.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.user?.createdAt
                        ? formatDate(student.user.createdAt)
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-brand-600 transition-colors"
                          aria-label="Edit student"
                          onClick={() => handleOpenEdit(student)}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(student)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          aria-label="Delete student"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {(() => {
              const start = (page - 1) * pageSize + 1;
              const end = start + students.length - 1;
              return total !== null ? (
                <span>
                  Showing <span className="font-medium">{start}</span> to{' '}
                  <span className="font-medium">{end}</span> of{' '}
                  <span className="font-medium">{total}</span> results
                </span>
              ) : (
                <span>
                  Showing <span className="font-medium">{students.length}</span>{' '}
                  results
                </span>
              );
            })()}
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={
                loading ||
                (total !== null
                  ? page >= Math.ceil(total / pageSize)
                  : students.length < pageSize)
              }
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedStudent ? 'Edit Student' : 'Add Student'}
              </h2>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsAddOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="space-y-1">
                <label htmlFor="add-email" className="text-sm text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="add-email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="add-password" className="text-sm text-gray-700">
                  Password {selectedStudent && '(leave blank to keep current)'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="add-password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 pr-10"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    required={!selectedStudent}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="add-name" className="text-sm text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="add-name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="add-phone" className="text-sm text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="add-phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phoneNumber: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="add-cohort" className="text-sm text-gray-700">
                  Cohort
                </label>
                <select
                  id="add-cohort"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={form.cohortId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, cohortId: e.target.value }))
                  }
                >
                  <option value="">No Cohort Assigned</option>
                  {cohorts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsAddOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
                  disabled={creating}
                >
                  {creating
                    ? 'Saving...'
                    : selectedStudent
                    ? 'Update Student'
                    : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
