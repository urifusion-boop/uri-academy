'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Calendar, FileText, Search, Pencil, Trash2 } from 'lucide-react';
import { api } from '@/services/api';
import type { Assignment, Cohort } from '@/types/schema';
import { formatDate } from '@/utils/date';
import { useToast } from '@/context/ToastContext';

export default function AdminAssignments() {
  const { addToast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCohortId, setSelectedCohortId] = useState('');

  // Edit state
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null,
  );
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dueAt: '',
    maxScore: 100,
    cohortId: '',
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete state
  const [deletingAssignment, setDeletingAssignment] =
    useState<Assignment | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueAt: '',
    maxScore: 100,
    cohortId: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [assignmentsData, cohortsData] = await Promise.all([
        api.assignments.list(),
        api.cohorts.list({ page: 1, pageSize: 100 }),
      ]);
      setAssignments(assignmentsData);
      setCohorts(cohortsData);
    } catch {
      addToast('Failed to load assignments', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      fetchData();
    } catch (error) {
      console.error('Failed to create assignment:', error);
      addToast('Failed to create assignment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    // Convert ISO date to datetime-local format (YYYY-MM-DDTHH:mm)
    const localDue = assignment.dueAt
      ? new Date(assignment.dueAt).toISOString().slice(0, 16)
      : '';
    setEditForm({
      title: assignment.title,
      description: assignment.description || '',
      dueAt: localDue,
      maxScore: assignment.maxScore,
      cohortId: assignment.cohortId || '',
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;
    try {
      setEditSubmitting(true);
      await api.assignments.update(editingAssignment.id, {
        title: editForm.title,
        description: editForm.description,
        dueAt: new Date(editForm.dueAt).toISOString(),
        maxScore: editForm.maxScore,
        cohortId: editForm.cohortId || null,
      });
      addToast('Assignment updated successfully', 'success');
      setEditingAssignment(null);
      fetchData();
    } catch (err: unknown) {
      console.error('Failed to update assignment:', err);
      const msg =
        err instanceof Error ? err.message : 'Failed to update assignment';
      addToast(msg, 'error');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAssignment) return;
    try {
      setDeleteSubmitting(true);
      await api.assignments.delete(deletingAssignment.id);
      addToast('Assignment deleted successfully', 'success');
      setDeletingAssignment(null);
      fetchData();
    } catch (err: unknown) {
      console.error('Failed to delete assignment:', err);
      const msg =
        err instanceof Error ? err.message : 'Failed to delete assignment';
      // Surface the conflict message (has submissions) directly
      addToast(msg, 'error');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading assignments...</div>;
  }

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCohort = !selectedCohortId || a.cohortId === selectedCohortId;
    return matchesSearch && matchesCohort;
  });

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

      <div
        id="search"
        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center mb-6"
      >
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by title or description..."
            title="Search assignments"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent focus:bg-white focus:border-brand-500 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <select
            aria-label="Filter by Cohort"
            title="Filter by Cohort"
            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 border-none focus:ring-0 cursor-pointer"
            value={selectedCohortId}
            onChange={(e) => setSelectedCohortId(e.target.value)}
          >
            <option value="">All Cohorts</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow animate-slide-up"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
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
                      {cohorts.find((c) => c.id === assignment.cohortId)
                        ?.name ?? 'Cohort specific'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(assignment)}
                  className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  title="Edit assignment"
                  aria-label="Edit assignment"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingAssignment(assignment)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete assignment"
                  aria-label="Delete assignment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
            <p className="text-gray-500">No assignments found</p>
          </div>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-up">
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
      {/* ── Edit Modal ── */}
      {editingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                Edit Assignment
              </h2>
              <button
                onClick={() => setEditingAssignment(null)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  title="Assignment title"
                  placeholder="e.g. Sales Pitch Deck"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  title="Assignment description"
                  placeholder="Describe the assignment requirements..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-dueAt"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Due Date
                  </label>
                  <input
                    id="edit-dueAt"
                    type="datetime-local"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                    value={editForm.dueAt}
                    onChange={(e) =>
                      setEditForm({ ...editForm, dueAt: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-maxScore"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Max Score
                  </label>
                  <input
                    id="edit-maxScore"
                    type="number"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                    value={editForm.maxScore}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        maxScore: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="edit-cohortId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Target Cohort (Optional)
                </label>
                <select
                  id="edit-cohortId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                  value={editForm.cohortId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, cohortId: e.target.value })
                  }
                >
                  <option value="">All Cohorts</option>
                  {cohorts.map((cohort) => (
                    <option key={cohort.id} value={cohort.id}>
                      {cohort.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setEditingAssignment(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  disabled={editSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium disabled:opacity-50 flex items-center gap-2"
                  disabled={editSubmitting}
                >
                  {editSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      {deletingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-slide-up">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-red-100 rounded-full shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Delete Assignment
                </h2>
                <p className="text-sm text-gray-600">
                  Are you sure you want to permanently delete{' '}
                  <span className="font-semibold">
                    "{deletingAssignment.title}"
                  </span>
                  ? This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingAssignment(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                disabled={deleteSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
