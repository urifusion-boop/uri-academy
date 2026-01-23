import {
  Video,
  ChevronDown,
  ChevronRight,
  Lock,
  Clock,
  FileText,
  Link as LinkIcon,
  CheckCircle,
  Circle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type {
  CurriculumItem,
  StudentProfile,
  ContentAsset,
} from '../types/schema';

export function Curriculum() {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Record<string, ContentAsset[]>>(
    {},
  );
  const [filter, setFilter] = useState<'ALL' | 'VIDEO' | 'DOC' | 'LINK'>('ALL');
  const [completedContent, setCompletedContent] = useState<Set<string>>(
    new Set(),
  );

  // Load completed content
  useEffect(() => {
    if (profile?.id) {
      try {
        const stored = localStorage.getItem(`completed_content_${profile.id}`);
        if (stored) {
          setCompletedContent(new Set(JSON.parse(stored)));
        }
      } catch (e) {
        console.warn('Failed to load completed content', e);
      }
    }
  }, [profile?.id]);

  // Pre-fetch all resources to show counts
  useEffect(() => {
    if (curriculum.length === 0) return;

    const fetchAll = async () => {
      const promises = curriculum.map(async (week) => {
        try {
          const items = await api.content.listByCurriculumItem(week.id);
          return { id: week.id, items };
        } catch {
          return { id: week.id, items: [] };
        }
      });

      const results = await Promise.all(promises);
      setResources((prev) => {
        const next = { ...prev };
        results.forEach((r) => {
          next[r.id] = r.items;
        });
        return next;
      });
    };

    fetchAll();
  }, [curriculum]);

  const toggleComplete = (contentId: string) => {
    setCompletedContent((prev) => {
      const next = new Set(prev);
      if (next.has(contentId)) {
        next.delete(contentId);
      } else {
        next.add(contentId);
      }
      if (profile?.id) {
        localStorage.setItem(
          `completed_content_${profile.id}`,
          JSON.stringify([...next]),
        );
      }
      return next;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const curriculumData = await api.getCurriculum();
        setCurriculum(curriculumData);
      } catch (error) {
        console.error('Failed to fetch curriculum:', error);
      }
      try {
        const profileData = await api.getCurrentUserProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to get current user profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loadResources = async () => {
      if (!expandedItemId) return;
      if (resources[expandedItemId]) return;
      try {
        const items = await api.content.listByCurriculumItem(expandedItemId);
        setResources((prev) => ({ ...prev, [expandedItemId]: items || [] }));
      } catch {
        setResources((prev) => ({ ...prev, [expandedItemId]: [] }));
      }
    };
    loadResources();
  }, [expandedItemId]);

  if (loading) {
    return <div className="p-8 text-center">Loading curriculum...</div>;
  }

  // Calculate stats based on loaded resources and local completion state
  const totalLessons = Object.values(resources).reduce(
    (acc, items) => acc + items.length,
    0,
  );

  const completedLessons = Object.values(resources).reduce((acc, items) => {
    return acc + items.filter((item) => completedContent.has(item.id)).length;
  }, 0);

  const overallProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const getPhaseInfo = (weekNum: number) => {
    if (weekNum === 1)
      return {
        title: 'Phase 1: The Blueprint',
        subtitle: 'Sales, People & Money',
      };
    if (weekNum === 2)
      return {
        title: 'Phase 2: The Build',
        subtitle: 'Conversations, Systems & Tools',
      };
    if (weekNum === 3)
      return {
        title: 'Phase 3: Placement',
        subtitle: 'Closing, Capstone & Career Readiness',
      };
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Course Curriculum
          </h1>
          <p className="text-gray-500">
            Track your progress and access your learning materials.
          </p>
        </div>

        <div className="bg-brand-50 rounded-xl p-6 flex items-center gap-6 min-w-[300px]">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                strokeDasharray={`${overallProgress}, 100`}
                className="animate-spin-slow origin-center transform -rotate-90 transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-brand-600 text-sm">
              {overallProgress}%
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              Overall Progress
            </div>
            <div className="text-xl font-bold text-gray-900">
              {completedLessons}/{totalLessons} Lessons
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {curriculum.length > 0 ? (
          curriculum.map((week) => {
            // Determine lock status based on progress (simplified logic)
            // If previous week is not done, this is locked.
            // For now, assuming only week 1 is unlocked or based on some property.
            // Since we lack granular data, let's unlock all for demo or use week index vs progress.
            const isLocked = false; // (week.week - 1) * 20 > overallProgress; // Example logic
            const phaseInfo = getPhaseInfo(week.week);

            return (
              <div key={week.id}>
                {phaseInfo && (
                  <div className="mb-4 mt-8 first:mt-0">
                    <h2 className="text-xl font-bold text-gray-900">
                      {phaseInfo.title}
                    </h2>
                    <p className="text-gray-500">{phaseInfo.subtitle}</p>
                  </div>
                )}
                <div
                  className={`border rounded-2xl bg-white overflow-hidden transition-all duration-300 ${
                    isLocked
                      ? 'opacity-75 bg-gray-50'
                      : 'hover:shadow-md hover:border-brand-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      !isLocked &&
                      setExpandedItemId(
                        expandedItemId === week.id ? null : week.id,
                      )
                    }
                    disabled={isLocked}
                    className="w-full flex items-center justify-between p-6 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                          isLocked
                            ? 'bg-gray-100 border-gray-300 text-gray-400'
                            : 'bg-brand-50 border-brand-500 text-brand-600'
                        }`}
                      >
                        {isLocked ? <Lock className="w-4 h-4" /> : week.week}
                      </div>
                      <div className="text-left">
                        <h2
                          className={`font-bold text-lg ${
                            isLocked ? 'text-gray-500' : 'text-gray-900'
                          }`}
                        >
                          Week {week.week}: {week.title}
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {week.durationMinutes}{' '}
                            mins
                          </span>
                          <span>•</span>
                          <span>{resources[week.id]?.length || 0} Lessons</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {expandedItemId === week.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {expandedItemId === week.id && !isLocked && (
                    <div className="border-t border-gray-100">
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <button
                            type="button"
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                              filter === 'ALL'
                                ? 'bg-brand-600 text-white border-brand-600'
                                : 'bg-white text-gray-700 border-gray-200'
                            }`}
                            onClick={() => setFilter('ALL')}
                          >
                            All
                          </button>
                          <button
                            type="button"
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                              filter === 'VIDEO'
                                ? 'bg-brand-600 text-white border-brand-600'
                                : 'bg-white text-gray-700 border-gray-200'
                            }`}
                            onClick={() => setFilter('VIDEO')}
                          >
                            Video
                          </button>
                          <button
                            type="button"
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                              filter === 'DOC'
                                ? 'bg-brand-600 text-white border-brand-600'
                                : 'bg-white text-gray-700 border-gray-200'
                            }`}
                            onClick={() => setFilter('DOC')}
                          >
                            Docs
                          </button>
                          <button
                            type="button"
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                              filter === 'LINK'
                                ? 'bg-brand-600 text-white border-brand-600'
                                : 'bg-white text-gray-700 border-gray-200'
                            }`}
                            onClick={() => setFilter('LINK')}
                          >
                            Links
                          </button>
                        </div>
                        {(resources[week.id] || [])
                          .filter((r) => filter === 'ALL' || r.type === filter)
                          .map((r) => (
                            <div
                              key={r.id}
                              className="flex items-center justify-between p-4 px-6 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleComplete(r.id);
                                  }}
                                  className={`text-gray-400 hover:text-brand-600 transition-colors ${
                                    completedContent.has(r.id)
                                      ? 'text-green-500 hover:text-green-600'
                                      : ''
                                  }`}
                                  title={
                                    completedContent.has(r.id)
                                      ? 'Mark as incomplete'
                                      : 'Mark as done'
                                  }
                                >
                                  {completedContent.has(r.id) ? (
                                    <CheckCircle className="w-5 h-5" />
                                  ) : (
                                    <Circle className="w-5 h-5" />
                                  )}
                                </button>

                                <a
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-4 flex-1"
                                >
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-50 text-brand-600">
                                    {r.type === 'VIDEO' ? (
                                      <Video className="w-5 h-5" />
                                    ) : r.type === 'DOC' ? (
                                      <FileText className="w-5 h-5" />
                                    ) : (
                                      <LinkIcon className="w-5 h-5" />
                                    )}
                                  </div>
                                  <div>
                                    <span
                                      className={`font-medium block ${
                                        completedContent.has(r.id)
                                          ? 'text-gray-500 line-through'
                                          : 'text-gray-900'
                                      }`}
                                    >
                                      {r.title}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {r.type}
                                    </span>
                                  </div>
                                </a>
                              </div>

                              <a
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-600 text-sm font-semibold hover:underline ml-4"
                              >
                                Open
                              </a>
                            </div>
                          ))}
                        {(!resources[week.id] ||
                          resources[week.id].filter(
                            (r) => filter === 'ALL' || r.type === filter,
                          ).length === 0) && (
                          <div className="p-6 text-center text-gray-500 text-sm">
                            No resources yet.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-500">
            No curriculum content found.
          </div>
        )}
      </div>
    </div>
  );
}
