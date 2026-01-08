import { useEffect, useState } from 'react';
import { Calendar, Users, Plus, MoreVertical } from 'lucide-react';
import { api } from '../services/api';
import {
  type Cohort,
  CohortStatus,
  type StudentProfile,
  type ContentAsset,
  type AttendanceSession,
  type AttendanceLog,
  AttendanceStatus,
} from '../types/schema';
import { formatDate } from '../utils/date';
import { useToast } from '../context/ToastContext';

export function AdminCohorts() {
  const { addToast } = useToast();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    status:
      CohortStatus.PLANNED as (typeof CohortStatus)[keyof typeof CohortStatus],
  });
  const [contentOpenFor, setContentOpenFor] = useState<Cohort | null>(null);
  const [contentItems, setContentItems] = useState<ContentAsset[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentForm, setContentForm] = useState({
    title: '',
    type: 'LINK',
    url: '',
  });
  const [contentSubmitting, setContentSubmitting] = useState(false);
  const [attendanceOpenFor, setAttendanceOpenFor] = useState<Cohort | null>(
    null
  );
  const [attendanceSessions, setAttendanceSessions] = useState<
    AttendanceSession[]
  >([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    date: '',
    topic: '',
    startHour: '09',
    startMinute: '00',
    startAmPm: 'AM',
    endHour: '10',
    endMinute: '00',
    endAmPm: 'AM',
  });
  const [selectedSession, setSelectedSession] =
    useState<AttendanceSession | null>(null);
  const [sessionLogs, setSessionLogs] = useState<AttendanceLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [savingLogId, setSavingLogId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cohortsResp, studentsData] = await Promise.all([
          api.cohorts.list(),
          api.getStudents(),
        ]);
        type ListEnvelope<T> = { items?: T[]; total?: number };
        const env = cohortsResp as ListEnvelope<Cohort>;
        const arr = cohortsResp as Cohort[];
        const cohortItems = Array.isArray(arr)
          ? arr
          : Array.isArray(env.items)
          ? env.items!
          : [];
        setCohorts(cohortItems);
        setStudents(Array.isArray(studentsData) ? studentsData : []);
      } catch (error) {
        console.error('Failed to fetch cohorts data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStudentCount = (cohortId: string) => {
    return students.filter((s) => s.cohortId === cohortId).length;
  };

  const getStatusColor = (status: CohortStatus) => {
    switch (status) {
      case CohortStatus.ACTIVE:
        return 'bg-green-100 text-green-700';
      case CohortStatus.PLANNED:
        return 'bg-blue-100 text-blue-700';
      case CohortStatus.COMPLETED:
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const openNew = () => {
    setForm({
      name: '',
      startDate: '',
      endDate: '',
      status: CohortStatus.PLANNED,
    });
    setIsNewOpen(true);
  };

  const submitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.endDate) {
      addToast('All fields are required', 'error');
      return;
    }
    try {
      setCreating(true);
      await api.cohorts.create({
        name: form.name,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        status: form.status,
      });
      const list = await api.cohorts.list();
      type ListEnvelope<T> = { items?: T[]; total?: number };
      const env = list as ListEnvelope<Cohort>;
      const arr = list as Cohort[];
      const items = Array.isArray(arr)
        ? arr
        : Array.isArray(env.items)
        ? env.items!
        : [];
      setCohorts(items);
      setIsNewOpen(false);
      addToast('Cohort created successfully', 'success');
    } catch {
      addToast('Failed to create cohort', 'error');
    } finally {
      setCreating(false);
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );
  const minutes = ['00', '15', '30', '45'];

  if (loading) {
    return <div className="p-8 text-center">Loading cohorts...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cohorts</h1>
        <button
          type="button"
          className="bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-700 transition-colors"
          onClick={openNew}
        >
          <Plus className="w-4 h-4" />
          New Cohort
        </button>
      </div>

      <div className="grid gap-4">
        {cohorts.map((cohort) => (
          <div
            key={cohort.id}
            className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {cohort.name}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    cohort.status
                  )}`}
                >
                  {cohort.status}
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(cohort.startDate)} -{' '}
                    {formatDate(cohort.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{getStudentCount(cohort.id)} Students</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                aria-label="More options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={async () => {
                  setContentOpenFor(cohort);
                  setContentLoading(true);
                  try {
                    const resp = await api.content.listByCohort(cohort.id, {
                      page: 1,
                      pageSize: 20,
                    });
                    type Env<T> = { items?: T[]; total?: number };
                    const env = resp as Env<ContentAsset>;
                    const arr = resp as ContentAsset[];
                    const items = Array.isArray(arr)
                      ? arr
                      : Array.isArray(env.items)
                      ? env.items!
                      : [];
                    setContentItems(items);
                  } catch {
                    addToast('Failed to load content', 'error');
                    setContentItems([]);
                  } finally {
                    setContentLoading(false);
                  }
                }}
              >
                Manage Content
              </button>
              <button
                type="button"
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={async () => {
                  setAttendanceOpenFor(cohort);
                  setAttendanceLoading(true);
                  setSelectedSession(null);
                  setSessionLogs([]);
                  try {
                    const resp = await api.attendance.getSessions({
                      cohortId: cohort.id,
                      page: 1,
                      pageSize: 50,
                    });
                    type Env<T> = { items?: T[]; total?: number };
                    const env = resp as Env<AttendanceSession>;
                    const arr = resp as AttendanceSession[];
                    const items = Array.isArray(arr)
                      ? arr
                      : Array.isArray(env.items)
                      ? env.items!
                      : [];
                    setAttendanceSessions(items);
                  } catch {
                    addToast('Failed to load attendance sessions', 'error');
                    setAttendanceSessions([]);
                  } finally {
                    setAttendanceLoading(false);
                  }
                }}
              >
                Manage Attendance
              </button>
            </div>
          </div>
        ))}

        {cohorts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed">
            <p className="text-gray-500">No cohorts found</p>
          </div>
        )}
      </div>
      {contentOpenFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Content for {contentOpenFor.name}
              </h2>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setContentOpenFor(null)}
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!contentForm.title || !contentForm.url) {
                    addToast('Title and URL are required', 'error');
                    return;
                  }
                  try {
                    setContentSubmitting(true);
                    await api.content.create({
                      title: contentForm.title,
                      type: contentForm.type,
                      url: contentForm.url,
                      cohortId: contentOpenFor.id,
                    });
                    const resp = await api.content.listByCohort(
                      contentOpenFor.id,
                      { page: 1, pageSize: 20 }
                    );
                    type Env<T> = { items?: T[]; total?: number };
                    const env = resp as Env<ContentAsset>;
                    const arr = resp as ContentAsset[];
                    const items = Array.isArray(arr)
                      ? arr
                      : Array.isArray(env.items)
                      ? env.items!
                      : [];
                    setContentItems(items);
                    setContentForm({ title: '', type: 'LINK', url: '' });
                    addToast('Content added successfully', 'success');
                  } catch {
                    addToast('Failed to add content', 'error');
                  } finally {
                    setContentSubmitting(false);
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-4 gap-3"
              >
                <div className="space-y-1 md:col-span-2">
                  <label htmlFor="cnt-title" className="text-sm text-gray-700">
                    Title
                  </label>
                  <input
                    id="cnt-title"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={contentForm.title}
                    onChange={(e) =>
                      setContentForm((f) => ({ ...f, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="cnt-type" className="text-sm text-gray-700">
                    Type
                  </label>
                  <select
                    id="cnt-type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={contentForm.type}
                    onChange={(e) =>
                      setContentForm((f) => ({ ...f, type: e.target.value }))
                    }
                  >
                    <option value="VIDEO">Video</option>
                    <option value="DOC">Document</option>
                    <option value="LINK">Link</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-4">
                  <label htmlFor="cnt-url" className="text-sm text-gray-700">
                    URL
                  </label>
                  <input
                    id="cnt-url"
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={contentForm.url}
                    onChange={(e) =>
                      setContentForm((f) => ({ ...f, url: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="md:col-span-4 flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
                    disabled={contentSubmitting}
                  >
                    {contentSubmitting ? 'Adding...' : 'Add Content'}
                  </button>
                </div>
              </form>

              <div className="divide-y divide-gray-100 border rounded-lg">
                {contentLoading ? (
                  <div className="p-4 text-gray-500">Loading content...</div>
                ) : contentItems.length === 0 ? (
                  <div className="p-4 text-gray-500">No content yet.</div>
                ) : (
                  contentItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.type} • {item.url}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                          onClick={async () => {
                            const newTitle = window.prompt(
                              'Update title',
                              item.title
                            );
                            if (newTitle === null) return;
                            try {
                              await api.content.update(item.id, {
                                title: newTitle,
                              });
                              const resp = await api.content.listByCohort(
                                contentOpenFor.id,
                                { page: 1, pageSize: 20 }
                              );
                              type Env<T> = { items?: T[]; total?: number };
                              const env = resp as Env<ContentAsset>;
                              const arr = resp as ContentAsset[];
                              const items = Array.isArray(arr)
                                ? arr
                                : Array.isArray(env.items)
                                ? env.items!
                                : [];
                              setContentItems(items);
                              addToast(
                                'Content updated successfully',
                                'success'
                              );
                            } catch {
                              addToast('Failed to update content', 'error');
                            }
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50"
                          onClick={async () => {
                            if (!window.confirm('Delete this content?')) return;
                            try {
                              await api.content.delete(item.id);
                              setContentItems((prev) =>
                                prev.filter((c) => c.id !== item.id)
                              );
                              addToast(
                                'Content deleted successfully',
                                'success'
                              );
                            } catch {
                              addToast('Failed to delete content', 'error');
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {attendanceOpenFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Attendance for {attendanceOpenFor.name}
              </h2>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setAttendanceOpenFor(null);
                  setSelectedSession(null);
                  setSessionLogs([]);
                }}
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-5 space-y-6">
              <form
                noValidate
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!sessionForm.date || !sessionForm.topic) {
                    addToast('Date and Topic are required', 'error');
                    return;
                  }
                  try {
                    setAttendanceLoading(true);

                    const convertTo24Hour = (
                      hour: string,
                      minute: string,
                      ampm: string
                    ) => {
                      let h = parseInt(hour, 10);
                      if (ampm === 'PM' && h < 12) h += 12;
                      if (ampm === 'AM' && h === 12) h = 0;
                      return `${h.toString().padStart(2, '0')}:${minute}`;
                    };

                    const startTimeStr = convertTo24Hour(
                      sessionForm.startHour,
                      sessionForm.startMinute,
                      sessionForm.startAmPm
                    );
                    const endTimeStr = convertTo24Hour(
                      sessionForm.endHour,
                      sessionForm.endMinute,
                      sessionForm.endAmPm
                    );

                    const startDateTime = new Date(
                      `${sessionForm.date}T${startTimeStr}`
                    );
                    const endDateTime = new Date(
                      `${sessionForm.date}T${endTimeStr}`
                    );

                    if (
                      isNaN(startDateTime.getTime()) ||
                      isNaN(endDateTime.getTime())
                    ) {
                      addToast('Invalid date or time format', 'error');
                      return;
                    }

                    await api.attendance.createSession({
                      date: new Date(sessionForm.date).toISOString(),
                      topic: sessionForm.topic,
                      startTime: startDateTime.toISOString(),
                      endTime: endDateTime.toISOString(),
                      cohortId: attendanceOpenFor.id,
                    });
                    const resp = await api.attendance.getSessions({
                      cohortId: attendanceOpenFor.id,
                      page: 1,
                      pageSize: 50,
                    });
                    type Env<T> = { items?: T[]; total?: number };
                    const env = resp as Env<AttendanceSession>;
                    const arr = resp as AttendanceSession[];
                    const items = Array.isArray(arr)
                      ? arr
                      : Array.isArray(env.items)
                      ? env.items!
                      : [];
                    setAttendanceSessions(items);
                    setSessionForm({
                      date: '',
                      topic: '',
                      startHour: '09',
                      startMinute: '00',
                      startAmPm: 'AM',
                      endHour: '10',
                      endMinute: '00',
                      endAmPm: 'AM',
                    });
                    addToast('Session created successfully', 'success');
                  } catch {
                    addToast('Failed to create session', 'error');
                  } finally {
                    setAttendanceLoading(false);
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-4 gap-3"
              >
                <div className="space-y-1">
                  <label htmlFor="att-date" className="text-sm text-gray-700">
                    Date
                  </label>
                  <input
                    id="att-date"
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={sessionForm.date}
                    onChange={(e) =>
                      setSessionForm((f) => ({ ...f, date: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label htmlFor="att-topic" className="text-sm text-gray-700">
                    Topic
                  </label>
                  <input
                    id="att-topic"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={sessionForm.topic}
                    onChange={(e) =>
                      setSessionForm((f) => ({ ...f, topic: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1 md:col-span-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 block mb-1">
                      Start Time
                    </label>
                    <div className="flex gap-2">
                      <select
                        aria-label="Start Hour"
                        className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={sessionForm.startHour}
                        onChange={(e) =>
                          setSessionForm((f) => ({
                            ...f,
                            startHour: e.target.value,
                          }))
                        }
                      >
                        {hours.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <span className="self-center">:</span>
                      <select
                        aria-label="Start Minute"
                        className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={sessionForm.startMinute}
                        onChange={(e) =>
                          setSessionForm((f) => ({
                            ...f,
                            startMinute: e.target.value,
                          }))
                        }
                      >
                        {minutes.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <select
                        aria-label="Start AM/PM"
                        className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={sessionForm.startAmPm}
                        onChange={(e) =>
                          setSessionForm((f) => ({
                            ...f,
                            startAmPm: e.target.value,
                          }))
                        }
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-1">
                      End Time
                    </label>
                    <div className="flex gap-2">
                      <select
                        aria-label="End Hour"
                        className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={sessionForm.endHour}
                        onChange={(e) =>
                          setSessionForm((f) => ({
                            ...f,
                            endHour: e.target.value,
                          }))
                        }
                      >
                        {hours.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <span className="self-center">:</span>
                      <select
                        aria-label="End Minute"
                        className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={sessionForm.endMinute}
                        onChange={(e) =>
                          setSessionForm((f) => ({
                            ...f,
                            endMinute: e.target.value,
                          }))
                        }
                      >
                        {minutes.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <select
                        aria-label="End AM/PM"
                        className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={sessionForm.endAmPm}
                        onChange={(e) =>
                          setSessionForm((f) => ({
                            ...f,
                            endAmPm: e.target.value,
                          }))
                        }
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-4 flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
                    disabled={attendanceLoading}
                  >
                    {attendanceLoading ? 'Creating...' : 'Create Session'}
                  </button>
                </div>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg">
                  <div className="px-4 py-2 border-b text-sm font-medium text-gray-700">
                    Sessions
                  </div>
                  {attendanceLoading ? (
                    <div className="p-4 text-gray-500">Loading sessions...</div>
                  ) : attendanceSessions.length === 0 ? (
                    <div className="p-4 text-gray-500">No sessions yet.</div>
                  ) : (
                    <ul className="divide-y">
                      {attendanceSessions.map((s) => (
                        <li
                          key={s.id}
                          className="p-3 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(s.date)} • {s.topic}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(s.startTime)} -{' '}
                              {formatDate(s.endTime)}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            onClick={async () => {
                              setSelectedSession(s);
                              setLogsLoading(true);
                              try {
                                const resp = await api.attendance.getLogs({
                                  sessionId: s.id,
                                  page: 1,
                                  pageSize: 100,
                                });
                                type Env<T> = { items?: T[]; total?: number };
                                const env = resp as Env<AttendanceLog>;
                                const arr = resp as AttendanceLog[];
                                const items = Array.isArray(arr)
                                  ? arr
                                  : Array.isArray(env.items)
                                  ? env.items!
                                  : [];
                                setSessionLogs(items);
                              } catch {
                                addToast('Failed to load logs', 'error');
                                setSessionLogs([]);
                              } finally {
                                setLogsLoading(false);
                              }
                            }}
                          >
                            View Logs
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="border rounded-lg">
                  <div className="px-4 py-2 border-b text-sm font-medium text-gray-700">
                    {selectedSession ? 'Logs' : 'Select a session'}
                  </div>
                  {!selectedSession ? (
                    <div className="p-4 text-gray-500">
                      Select a session to manage attendance.
                    </div>
                  ) : logsLoading ? (
                    <div className="p-4 text-gray-500">Loading logs...</div>
                  ) : (
                    <div className="p-2">
                      {students
                        .filter((s) => s.cohortId === attendanceOpenFor.id)
                        .map((stud) => {
                          const existing = sessionLogs.find(
                            (l) => l.studentId === stud.id
                          );
                          const statusValue = existing ? existing.status : '';
                          return (
                            <div
                              key={stud.id}
                              className="flex items-center justify-between p-2 border-b last:border-b-0"
                            >
                              <div className="text-sm text-gray-900">
                                {stud.user?.name || stud.userId}
                              </div>
                              <div className="flex items-center gap-2">
                                <select
                                  className="px-2 py-1 border rounded"
                                  aria-label={`Attendance status for ${
                                    stud.user?.name || stud.userId
                                  }`}
                                  value={statusValue}
                                  onChange={(e) => {
                                    const newStatus = e.target
                                      .value as AttendanceStatus;
                                    const updated = existing
                                      ? sessionLogs.map((l) =>
                                          l.id === existing.id
                                            ? { ...l, status: newStatus }
                                            : l
                                        )
                                      : [
                                          ...sessionLogs,
                                          {
                                            id: `${selectedSession.id}-${stud.id}`,
                                            sessionId: selectedSession.id,
                                            studentId: stud.id,
                                            status: newStatus,
                                          } as AttendanceLog,
                                        ];
                                    setSessionLogs(updated);
                                  }}
                                >
                                  <option value="">Set status</option>
                                  <option value={AttendanceStatus.PRESENT}>
                                    Present
                                  </option>
                                  <option value={AttendanceStatus.ABSENT}>
                                    Absent
                                  </option>
                                  <option value={AttendanceStatus.LATE}>
                                    Late
                                  </option>
                                </select>
                                <button
                                  type="button"
                                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                  disabled={savingLogId === stud.id}
                                  onClick={async () => {
                                    const toSave = sessionLogs.find(
                                      (l) => l.studentId === stud.id
                                    );
                                    if (!toSave || !toSave.status) return;
                                    setSavingLogId(stud.id);
                                    try {
                                      await api.attendance.logSession(
                                        selectedSession.id,
                                        {
                                          studentId: stud.id,
                                          status: toSave.status,
                                        }
                                      );
                                      addToast('Attendance saved', 'success');
                                    } catch {
                                      addToast(
                                        'Failed to save attendance',
                                        'error'
                                      );
                                    } finally {
                                      setSavingLogId(null);
                                    }
                                  }}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isNewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                New Cohort
              </h2>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsNewOpen(false)}
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={submitNew} className="px-6 py-5 space-y-4">
              <div className="space-y-1">
                <label htmlFor="cohort-name" className="text-sm text-gray-700">
                  Name
                </label>
                <input
                  id="cohort-name"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="cohort-start"
                    className="text-sm text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    id="cohort-start"
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, startDate: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="cohort-end" className="text-sm text-gray-700">
                    End Date
                  </label>
                  <input
                    id="cohort-end"
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, endDate: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="cohort-status"
                  className="text-sm text-gray-700"
                >
                  Status
                </label>
                <select
                  id="cohort-status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target
                        .value as (typeof CohortStatus)[keyof typeof CohortStatus],
                    }))
                  }
                >
                  <option value={CohortStatus.PLANNED}>Planned</option>
                  <option value={CohortStatus.ACTIVE}>Active</option>
                  <option value={CohortStatus.COMPLETED}>Completed</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsNewOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
