import { useEffect, useState } from 'react';
import { Plus, Calendar, FileText } from 'lucide-react';
import { api } from '../services/api';
import type { Assignment, Cohort } from '../types/schema';
import { formatDate } from '../utils/date';
import { useToast } from '../context/ToastContext';

export function AdminAssignments() {
  const { addToast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueAt: '',
    maxScore: 100,
    cohortId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsData, cohortsData] = await Promise.all([
        api.assignments.list(),
        api.cohorts.list({ page: 1, pageSize: 100 }), // Fetch all active cohorts
      ]);
      setAssignments(assignmentsData);
      setCohorts(cohortsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      addToast('Failed to load assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.dueAt) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.assignments.create({
        ...form,
        dueAt: new Date(form.dueAt).toISOString(),
      });
      addToast('Assignment created successfully', 'success');
      setIsCreating(false);
      setForm({
        title: '',
        description: '',
        dueAt: '',
        maxScore: 100,
        cohortId: '',
      });
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to create assignment:', error);
      addToast('Failed to create assignment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Note: Deletion endpoint might not exist or might be restricted if submissions exist
  // We'll omit deletion for now unless explicitly requested or verified

  if (loading) {
    return <div className="p-8 text-center">Loading assignments...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-500">Manage course assignments and tasks</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </button>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {assignment.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {assignment.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {formatDate(assignment.dueAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    Max Score: {assignment.maxScore}
                  </div>
                  {assignment.cohortId && (
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                      Cohort specific
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {assignments.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
            <p className="text-gray-500">No assignments found</p>
          </div>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                Create Assignment
              </h2>
              <button
                onClick={() => setIsCreating(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Sales Pitch Deck"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the assignment requirements..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dueAt"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Due Date
                  </label>
                  <input
                    id="dueAt"
                    type="datetime-local"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                    value={form.dueAt}
                    onChange={(e) =>
                      setForm({ ...form, dueAt: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="maxScore"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Max Score
                  </label>
                  <input
                    id="maxScore"
                    type="number"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                    value={form.maxScore}
                    onChange={(e) =>
                      setForm({ ...form, maxScore: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="cohortId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Target Cohort (Optional)
                </label>
                <select
                  id="cohortId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                  value={form.cohortId}
                  onChange={(e) =>
                    setForm({ ...form, cohortId: e.target.value })
                  }
                >
                  <option value="">All Cohorts</option>
                  {cohorts.map((cohort) => (
                    <option key={cohort.id} value={cohort.id}>
                      {cohort.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to assign to all active students
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium disabled:opacity-50 flex items-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
