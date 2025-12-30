import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Cohort, ContentAsset, ContentType } from '../types/schema';
import { useToast } from '../context/ToastContext';

export function AdminContent() {
  const { addToast } = useToast();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState<string>('');
  const [items, setItems] = useState<ContentAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [form, setForm] = useState<{
    title: string;
    type: ContentType | string;
    url: string;
  }>({
    title: '',
    type: 'LINK',
    url: '',
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      try {
        const cohortList = await api.cohorts.list();
        const arr = Array.isArray(cohortList)
          ? cohortList
          : (cohortList as { items?: Cohort[] }).items || [];
        setCohorts(arr);
        const firstId = arr[0]?.id || '';
        setSelectedCohortId(firstId);
        if (firstId) {
          await loadContent(firstId);
        } else {
          setItems([]);
        }
      } catch {
        addToast('Failed to load cohorts', 'error');
        setCohorts([]);
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadContent = async (cohortId: string) => {
    setLoading(true);
    try {
      const resp = await api.content.listByCohort(cohortId, {
        page: 1,
        pageSize: 50,
      });
      const arr = Array.isArray(resp)
        ? (resp as ContentAsset[])
        : (resp as { items?: ContentAsset[] }).items || [];
      setItems(arr);
    } catch {
      addToast('Failed to load content', 'error');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id: string) => {
    if (!window.confirm('Delete this content?')) return;
    try {
      await api.content.delete(id);
      await loadContent(selectedCohortId);
      addToast('Content deleted successfully', 'success');
    } catch {
      addToast('Failed to delete content', 'error');
    }
  };

  // Cohort deletion is handled elsewhere; keep UI focused on content

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCohortId) {
      addToast('Please select a cohort', 'error');
      return;
    }
    if (!form.title || !form.url) {
      addToast('Title and URL are required', 'error');
      return;
    }
    try {
      setSubmitting(true);
      await api.content.create({
        title: form.title,
        type: form.type as ContentType,
        url: form.url,
        cohortId: selectedCohortId,
      });
      await loadContent(selectedCohortId);
      setForm({ title: '', type: 'LINK', url: '' });
      addToast('Content added successfully', 'success');
    } catch {
      addToast('Failed to add content', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading content...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="cnt-cohort" className="text-sm text-gray-700">
              Cohort
            </label>
            <select
              id="cnt-cohort"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={selectedCohortId}
              onChange={async (e) => {
                const id = e.target.value;
                setSelectedCohortId(id);
                if (id) await loadContent(id);
                else setItems([]);
              }}
            >
              <option value="">Select cohort</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="cnt-title" className="text-sm text-gray-700">
              Title
            </label>
            <input
              id="cnt-title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
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
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
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
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-4 flex items-center justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
              disabled={submitting || !selectedCohortId}
            >
              {submitting ? 'Adding...' : 'Add Content'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border">
        <div className="px-6 py-3 border-b text-sm font-medium text-gray-700">
          Content Items
        </div>
        {items.length === 0 ? (
          <div className="p-6 text-gray-500">
            No content found for the selected cohort.
          </div>
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li
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
                        await api.content.update(item.id, { title: newTitle });
                        if (selectedCohortId)
                          await loadContent(selectedCohortId);
                        addToast('Content updated successfully', 'success');
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
                    onClick={() => deleteContent(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
