import { useState, useEffect } from 'react';
import { FileText, Link as LinkIcon, Video } from 'lucide-react';
import { api } from '../services/api';
import type {
  StudentProfile,
  CurriculumItem,
  ContentAsset,
} from '../types/schema';

export function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [cohortContent, setCohortContent] = useState<ContentAsset[]>([]);
  const [nextSession, setNextSession] = useState<string>(
    'No upcoming sessions'
  );
  const [assignmentStats, setAssignmentStats] = useState({
    completed: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, curriculumData] = await Promise.all([
          api.getCurrentUserProfile(),
          api.getCurriculum(),
        ]);
        setProfile(profileData);
        setCurriculum(curriculumData);

        // Fetch assignments stats
        try {
          const [assignments, submissions] = await Promise.all([
            api.assignments.list(),
            api.assignments.getSubmissions().catch(() => []),
          ]);
          const total = assignments.length;
          // Count submissions that are either REVIEWED or PENDING (meaning submitted)
          const submittedCount =
            submissions.length || profileData?.submissions?.length || 0;
          setAssignmentStats({ completed: submittedCount, total });
        } catch (e) {
          console.error('Failed to load assignments', e);
        }

        if (profileData?.cohortId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const content: any = await api.content.listByCohort(
            profileData.cohortId
          );
          setCohortContent(
            Array.isArray(content)
              ? content
              : content && Array.isArray(content.items)
              ? content.items
              : []
          );

          // Fetch next session
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sessions: any[] = await api.attendance.getSessions({
              cohortId: profileData.cohortId,
            });
            const now = new Date();
            const upcoming = sessions
              .filter((s) => new Date(s.startTime) > now)
              .sort(
                (a, b) =>
                  new Date(a.startTime).getTime() -
                  new Date(b.startTime).getTime()
              )[0];

            if (upcoming) {
              const date = new Date(upcoming.startTime);
              const isTomorrow =
                new Date().getDate() + 1 === date.getDate() &&
                new Date().getMonth() === date.getMonth() &&
                new Date().getFullYear() === date.getFullYear();
              const timeStr = date.toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              });

              setNextSession(
                isTomorrow
                  ? `Tomorrow, ${timeStr}`
                  : date.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })
              );
            }
          } catch (e) {
            console.error('Failed to load sessions', e);
          }
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading profile</div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Course Progress',
      value: `${profile.progress}%`,
      color: 'bg-brand-500',
    },
    {
      label: 'Assignments Completed',
      value: `${assignmentStats.completed}/${assignmentStats.total}`,
      color: 'bg-green-500',
    },
    { label: 'Next Session', value: nextSession, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile.user?.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your cohort today.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm font-medium text-gray-500 mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            {i === 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div
                  className="bg-brand-600 h-2.5 rounded-full"
                  style={{ width: `${profile.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {cohortContent.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Cohort Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {cohortContent.slice(0, 4).map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center p-3 border rounded-lg hover:shadow-sm hover:border-brand-300 transition-all"
              >
                <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600 mr-3">
                  {item.type === 'VIDEO' ? (
                    <Video className="w-5 h-5" />
                  ) : item.type === 'DOC' ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <LinkIcon className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {item.type.toLowerCase()}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-bold mb-4">
          Current Module: {curriculum[0]?.title || 'Loading...'}
        </h2>
        <div className="space-y-4">
          {curriculum.slice(0, 3).map((item, index) => (
            <div
              key={item.id}
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold mr-4">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  Video • {item.durationMinutes} mins
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 rounded-lg"
              >
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
