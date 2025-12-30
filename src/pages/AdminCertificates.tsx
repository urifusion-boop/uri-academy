import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { StudentProfile, Certificate, Cohort } from '../types/schema';
import { useToast } from '../context/ToastContext';

export function AdminCertificates() {
  const { addToast } = useToast();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [form, setForm] = useState<{
    studentId: string;
    serialNumber: string;
    fileURL: string;
  }>({
    studentId: '',
    serialNumber: '',
    fileURL: '',
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [cohortFilter, setCohortFilter] = useState<string>('');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      try {
        const [studs, cohs] = await Promise.all([
          api.getStudents({ page: 1, pageSize: 100 }),
          api.getCohorts(),
        ]);
        const arrStuds = Array.isArray(studs) ? studs : [];
        const arrCohs = Array.isArray(cohs) ? cohs : [];
        setStudents(arrStuds);
        setCohorts(arrCohs);
        // Do not force select a student initially to allow viewing all certificates
        await loadCertificates({});
      } catch {
        addToast('Failed to load initial data', 'error');
        setStudents([]);
        setCohorts([]);
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCertificates = async (params?: {
    studentId?: string;
    status?: string;
    cohortId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setLoading(true);
    try {
      const resp = await api.certificates.list({
        studentId: params?.studentId || selectedStudentId || undefined,
        status: params?.status || statusFilter || undefined,
        cohortId: params?.cohortId || cohortFilter || undefined,
        startDate: params?.startDate || startDateFilter || undefined,
        endDate: params?.endDate || endDateFilter || undefined,
        page: 1,
        pageSize: 100,
      });
      const arr = Array.isArray(resp)
        ? (resp as Certificate[])
        : (resp as { items?: Certificate[] }).items || [];
      setItems(arr);
    } catch {
      addToast('Failed to load certificates', 'error');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (changes: {
    studentId?: string;
    status?: string;
    cohortId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    // Update state first
    if (changes.studentId !== undefined)
      setSelectedStudentId(changes.studentId);
    if (changes.status !== undefined) setStatusFilter(changes.status);
    if (changes.cohortId !== undefined) setCohortFilter(changes.cohortId);
    if (changes.startDate !== undefined) setStartDateFilter(changes.startDate);
    if (changes.endDate !== undefined) setEndDateFilter(changes.endDate);

    // Then reload with new values combined with existing state (overridden by changes)
    await loadCertificates({
      studentId:
        changes.studentId !== undefined ? changes.studentId : selectedStudentId,
      status: changes.status !== undefined ? changes.status : statusFilter,
      cohortId:
        changes.cohortId !== undefined ? changes.cohortId : cohortFilter,
      startDate:
        changes.startDate !== undefined ? changes.startDate : startDateFilter,
      endDate: changes.endDate !== undefined ? changes.endDate : endDateFilter,
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.serialNumber || !form.fileURL) {
      addToast('All fields are required', 'error');
      return;
    }
    try {
      setSubmitting(true);
      await api.certificates.create({
        studentId: form.studentId,
        serialNumber: form.serialNumber,
        fileURL: form.fileURL,
        issuedAt: new Date().toISOString(),
        status: 'GENERATED',
      });
      await loadCertificates({});
      setForm({ studentId: form.studentId, serialNumber: '', fileURL: '' });
      addToast('Certificate issued successfully', 'success');
    } catch {
      addToast('Failed to issue certificate', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && items.length === 0 && students.length === 0) {
    return <div className="p-8 text-center">Loading certificates...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Certificates Management
        </h1>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="space-y-1">
            <label htmlFor="cert-student" className="text-sm text-gray-700">
              Student
            </label>
            <select
              id="cert-student"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={selectedStudentId}
              onChange={(e) =>
                handleFilterChange({ studentId: e.target.value })
              }
            >
              <option value="">All Students</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.user?.name || s.userId}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="cert-cohort" className="text-sm text-gray-700">
              Cohort
            </label>
            <select
              id="cert-cohort"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={cohortFilter}
              onChange={(e) => handleFilterChange({ cohortId: e.target.value })}
            >
              <option value="">All Cohorts</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="cert-status" className="text-sm text-gray-700">
              Status
            </label>
            <select
              id="cert-status"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={statusFilter}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="GENERATED">Generated</option>
              <option value="REVOKED">Revoked</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-700">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                value={startDateFilter}
                onChange={(e) =>
                  handleFilterChange({ startDate: e.target.value })
                }
                placeholder="Start"
              />
              <input
                type="date"
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                value={endDateFilter}
                onChange={(e) =>
                  handleFilterChange({ endDate: e.target.value })
                }
                placeholder="End"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Issue New Certificate
          </h3>
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div className="space-y-1">
              <label htmlFor="issue-student" className="text-sm text-gray-700">
                Student
              </label>
              <select
                id="issue-student"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={form.studentId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, studentId: e.target.value }))
                }
                required
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.user?.name || s.userId}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="cert-serial" className="text-sm text-gray-700">
                Serial Number
              </label>
              <input
                id="cert-serial"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={form.serialNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, serialNumber: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="cert-url" className="text-sm text-gray-700">
                Certificate File URL
              </label>
              <input
                id="cert-url"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={form.fileURL}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fileURL: e.target.value }))
                }
                required
              />
            </div>
            <div className="md:col-span-4 flex items-center justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
                disabled={submitting || !form.studentId}
              >
                {submitting ? 'Issuing...' : 'Issue Certificate'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl border">
        <div className="px-6 py-3 border-b text-sm font-medium text-gray-700">
          Certificates
        </div>
        {items.length === 0 ? (
          <div className="p-6 text-gray-500">No certificates found.</div>
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li
                key={item.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {students.find((s) => s.id === item.studentId)?.user
                      ?.name || item.studentId}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.serialNumber} • {item.status} • {item.fileURL}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={item.fileURL}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View
                  </a>
                  {item.status !== 'REVOKED' && (
                    <button
                      type="button"
                      className="px-3 py-1.5 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50"
                      onClick={async () => {
                        if (!window.confirm('Revoke this certificate?')) return;
                        try {
                          await api.certificates.revoke(item.id);
                          setItems((prev) =>
                            prev.map((c) =>
                              c.id === item.id ? { ...c, status: 'REVOKED' } : c
                            )
                          );
                          addToast(
                            'Certificate revoked successfully',
                            'success'
                          );
                        } catch {
                          addToast('Failed to revoke certificate', 'error');
                        }
                      }}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
