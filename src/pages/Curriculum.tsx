import { Video, ChevronDown, ChevronRight, Lock, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { CurriculumItem, StudentProfile } from '../types/schema';

export function Curriculum() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [curriculumData, profileData] = await Promise.all([
          api.getCurriculum(),
          api.getCurrentUserProfile(),
        ]);
        setCurriculum(curriculumData);
        setProfile(profileData);
        if (curriculumData.length > 0) {
          // Default expand current week or first week
          setExpandedWeek(curriculumData[0].week);
        }
      } catch (error) {
        console.error('Failed to fetch curriculum:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading curriculum...</div>;
  }

  // Calculate stats based on profile progress
  // Note: Backend should ideally provide granular progress per module.
  // Using global progress for now.
  const overallProgress = profile?.progress || 0;
  const totalLessons = curriculum.reduce(
    (acc, week) => acc + (week.topics?.length || 0),
    0
  );
  // Estimate completed lessons based on progress %
  const completedLessons = Math.round((overallProgress / 100) * totalLessons);

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

            return (
              <div
                key={week.id}
                className={`border rounded-2xl bg-white overflow-hidden transition-all duration-300 ${
                  isLocked
                    ? 'opacity-75 bg-gray-50'
                    : 'hover:shadow-md hover:border-brand-200'
                }`}
              >
                <button
                  onClick={() =>
                    !isLocked &&
                    setExpandedWeek(
                      expandedWeek === week.week ? null : week.week
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
                        <span>{week.topics?.length || 0} Lessons</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {expandedWeek === week.week ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {expandedWeek === week.week && !isLocked && (
                  <div className="border-t border-gray-100">
                    {week.topics?.map((topic, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 px-6 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors border-gray-300 group-hover:border-brand-400`}
                          >
                            {/* Checkmark if completed */}
                          </div>

                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-50 text-brand-600">
                            <Video className="w-5 h-5" />
                          </div>

                          <div>
                            <span className="font-medium block text-gray-900">
                              {topic}
                            </span>
                          </div>
                        </div>

                        <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow-brand-200">
                          Start
                        </button>
                      </div>
                    ))}
                    {(!week.topics || week.topics.length === 0) && (
                      <div className="p-6 text-center text-gray-500 text-sm">
                        No content available for this week yet.
                      </div>
                    )}
                  </div>
                )}
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
