import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type {
  Cohort,
  ContentAsset,
  ContentType,
  CurriculumItem,
} from '../types/schema';
import { useToast } from '../context/ToastContext';

export function AdminContent() {
  const { addToast } = useToast();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState<string>('');
  const [items, setItems] = useState<ContentAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mode, setMode] = useState<'cohort' | 'curriculum' | 'structure'>(
    'curriculum'
  );
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [selectedCurriculumItemId, setSelectedCurriculumItemId] =
    useState<string>('');
  const [curriculumForm, setCurriculumForm] = useState<{
    week: number;
    title: string;
    description: string;
    durationMinutes: number;
    topics: string;
    icon: string;
  }>({
    week: 1,
    title: '',
    description: '',
    durationMinutes: 120,
    topics: '',
    icon: 'BookOpen',
  });
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
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

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
        const curriculumData = await api.getCurriculum();
        setCurriculum(curriculumData);
        const firstCurriculumId = curriculumData[0]?.id || '';
        setSelectedCurriculumItemId(firstCurriculumId);
        if (mode === 'cohort') {
          if (firstId) {
            await loadContentByCohort(firstId);
          } else {
            setItems([]);
          }
        } else {
          if (firstCurriculumId) {
            await loadContentByCurriculum(firstCurriculumId);
          } else {
            setItems([]);
          }
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

  const loadContentByCohort = async (cohortId: string) => {
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
  const loadContentByCurriculum = async (curriculumItemId: string) => {
    setLoading(true);
    try {
      const resp = await api.content.listByCurriculumItem(curriculumItemId);
      const arr = Array.isArray(resp)
        ? (resp as ContentAsset[])
        : (resp as { items?: ContentAsset[] }).items || [];
      setItems(arr);
    } catch {
      addToast('Failed to load curriculum resources', 'error');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id: string) => {
    if (!window.confirm('Delete this content?')) return;
    try {
      await api.content.delete(id);
      if (mode === 'cohort' && selectedCohortId) {
        await loadContentByCohort(selectedCohortId);
      }
      if (mode === 'curriculum' && selectedCurriculumItemId) {
        await loadContentByCurriculum(selectedCurriculumItemId);
      }
      addToast('Content deleted successfully', 'success');
    } catch {
      addToast('Failed to delete content', 'error');
    }
  };

  // Cohort deletion is handled elsewhere; keep UI focused on content

  const handleSaveCurriculumItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...curriculumForm,
        topics: curriculumForm.topics
          .split('\n')
          .map((t) => t.trim())
          .filter(Boolean),
        orderIndex: curriculumForm.week,
      };

      if (editingModuleId) {
        await api.curriculum.update(editingModuleId, payload);
        addToast('Module updated successfully', 'success');
      } else {
        await api.curriculum.create(payload);
        addToast('Module created successfully', 'success');
      }

      const data = await api.getCurriculum();
      setCurriculum(data);
      if (!editingModuleId) {
        setCurriculumForm({
          week: data.length + 1,
          title: '',
          description: '',
          durationMinutes: 120,
          topics: '',
          icon: 'BookOpen',
        });
      } else {
        setEditingModuleId(null);
        setCurriculumForm({
          week: data.length + 1,
          title: '',
          description: '',
          durationMinutes: 120,
          topics: '',
          icon: 'BookOpen',
        });
      }
    } catch {
      addToast(
        editingModuleId ? 'Failed to update module' : 'Failed to create module',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (item: CurriculumItem) => {
    setEditingModuleId(item.id);
    setCurriculumForm({
      week: item.week,
      title: item.title,
      description: item.description,
      durationMinutes: item.durationMinutes,
      topics: item.topics?.join('\n') || '',
      icon: item.icon || 'BookOpen',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingModuleId(null);
    setCurriculumForm({
      week: curriculum.length + 1,
      title: '',
      description: '',
      durationMinutes: 120,
      topics: '',
      icon: 'BookOpen',
    });
  };

  const handleDeleteCurriculumItem = async (id: string) => {
    if (
      !window.confirm(
        'Delete this module? This will delete all associated content.'
      )
    )
      return;
    try {
      await api.curriculum.delete(id);
      addToast('Module deleted successfully', 'success');
      const data = await api.getCurriculum();
      setCurriculum(data);
    } catch {
      addToast('Failed to delete module', 'error');
    }
  };

  const handleSeed = async () => {
    if (
      !window.confirm(
        'Seed the database with default curriculum? This may create duplicates if data exists.'
      )
    )
      return;
    setSubmitting(true);
    try {
      await api.curriculum.seed();
      addToast('Database seeded successfully', 'success');
      const data = await api.getCurriculum();
      setCurriculum(data);
    } catch {
      addToast('Failed to seed database', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'cohort' && !selectedCohortId) {
      addToast('Please select a cohort', 'error');
      return;
    }
    if (mode === 'curriculum' && !selectedCurriculumItemId) {
      addToast('Please select a curriculum topic', 'error');
      return;
    }
    if (!form.title || !form.url) {
      addToast('Title and URL are required', 'error');
      return;
    }
    try {
      setSubmitting(true);
      const payload: Record<string, unknown> = {
        title: form.title,
        type: form.type as ContentType,
        url: form.url,
      };
      if (mode === 'cohort') {
        payload.cohortId = selectedCohortId;
      } else {
        payload.curriculumItemId = selectedCurriculumItemId;
      }
      await api.content.create(payload);
      if (mode === 'cohort' && selectedCohortId) {
        await loadContentByCohort(selectedCohortId);
      }
      if (mode === 'curriculum' && selectedCurriculumItemId) {
        await loadContentByCurriculum(selectedCurriculumItemId);
      }
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
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              mode === 'cohort'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
            onClick={async () => {
              setMode('cohort');
              if (selectedCohortId) await loadContentByCohort(selectedCohortId);
              else setItems([]);
            }}
          >
            Cohort Content
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              mode === 'curriculum'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
            onClick={async () => {
              setMode('curriculum');
              if (selectedCurriculumItemId)
                await loadContentByCurriculum(selectedCurriculumItemId);
              else setItems([]);
            }}
          >
            Curriculum Resources
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              mode === 'structure'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
            onClick={() => setMode('structure')}
          >
            Manage Structure
          </button>
        </div>
        {mode !== 'structure' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {mode === 'cohort' ? (
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
                    if (id) await loadContentByCohort(id);
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
            ) : (
              <div className="space-y-1 md:col-span-2">
                <label
                  htmlFor="cnt-curriculum"
                  className="text-sm text-gray-700"
                >
                  Curriculum Topic
                </label>
                <select
                  id="cnt-curriculum"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={selectedCurriculumItemId}
                  onChange={async (e) => {
                    const id = e.target.value;
                    setSelectedCurriculumItemId(id);
                    if (id) await loadContentByCurriculum(id);
                    else setItems([]);
                  }}
                >
                  <option value="">Select topic</option>
                  {curriculum.map((c) => (
                    <option key={c.id} value={c.id}>
                      {`Week ${c.week}: ${c.title}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {mode === 'structure' ? (
          <form
            onSubmit={handleSaveCurriculumItem}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div className="space-y-1">
              <label htmlFor="curr-week" className="text-sm text-gray-700">
                Week
              </label>
              <input
                id="curr-week"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={curriculumForm.week}
                onChange={(e) =>
                  setCurriculumForm((f) => ({
                    ...f,
                    week: parseInt(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-1 md:col-span-3">
              <label htmlFor="curr-title" className="text-sm text-gray-700">
                Title
              </label>
              <input
                id="curr-title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={curriculumForm.title}
                onChange={(e) =>
                  setCurriculumForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-1 md:col-span-4">
              <label htmlFor="curr-desc" className="text-sm text-gray-700">
                Description
              </label>
              <textarea
                id="curr-desc"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={curriculumForm.description}
                onChange={(e) =>
                  setCurriculumForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
                rows={2}
                required
              />
            </div>
            <div className="space-y-1 md:col-span-4">
              <label htmlFor="curr-topics" className="text-sm text-gray-700">
                Topics (one per line)
              </label>
              <textarea
                id="curr-topics"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={curriculumForm.topics}
                onChange={(e) =>
                  setCurriculumForm((f) => ({ ...f, topics: e.target.value }))
                }
                rows={3}
                placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
                required
              />
            </div>
            <div className="md:col-span-4 flex justify-end gap-2">
              {editingModuleId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting
                  ? editingModuleId
                    ? 'Updating...'
                    : 'Creating...'
                  : editingModuleId
                  ? 'Update Module'
                  : 'Create Module'}
              </button>
            </div>
          </form>
        ) : (
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
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
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
                required
              />
            </div>
            <div className="md:col-span-4 flex items-center justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
                disabled={
                  submitting ||
                  (mode === 'cohort' && !selectedCohortId) ||
                  (mode === 'curriculum' && !selectedCurriculumItemId)
                }
              >
                {submitting ? 'Adding...' : 'Add Content'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-xl border">
        <div className="px-6 py-3 border-b text-sm font-medium text-gray-700">
          {mode === 'structure' ? 'Curriculum Modules' : 'Content Items'}
        </div>
        {mode === 'structure' ? (
          curriculum.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">No modules found.</p>
              <button
                type="button"
                onClick={handleSeed}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Seeding...' : 'Seed Default Curriculum'}
              </button>
            </div>
          ) : (
            <ul className="divide-y">
              {curriculum.map((item) => (
                <li
                  key={item.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Week {item.week}: {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.topics?.length || 0} topics • {item.durationMinutes}{' '}
                      mins
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteCurriculumItem(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : items.length === 0 ? (
          <div className="p-6 text-gray-500">
            No content found for the selected{' '}
            {mode === 'cohort' ? 'cohort' : 'curriculum'}.
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
                        if (mode === 'cohort' && selectedCohortId) {
                          await loadContentByCohort(selectedCohortId);
                        }
                        if (mode === 'curriculum' && selectedCurriculumItemId) {
                          await loadContentByCurriculum(
                            selectedCurriculumItemId
                          );
                        }
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
