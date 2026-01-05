import { useEffect, useState } from 'react';
import {
  PlayCircle,
  Clock,
  Calendar,
  ArrowRight,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type {
  StudentProfile,
  CurriculumItem,
  Assignment,
  AttendanceSession,
  Submission,
} from '../types/schema';
import { formatDate } from '../utils/date';

export function StudentHome() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile first as it's critical
        const profileData = await api.getCurrentUserProfile().catch((e) => {
          console.error('Failed to load profile:', e);
          return null;
        });
        setProfile(profileData);

        // Fetch other data in parallel, allowing failures
        const [curriculumData, assignmentsData, sessionsData, submissionsData] =
          await Promise.all([
            api.getCurriculum().catch(() => []),
            api.assignments.list().catch(() => []),
            api.attendance.getSessions().catch(() => []) as Promise<
              AttendanceSession[]
            >,
            api.assignments.getSubmissions().catch(() => []),
          ]);

        setCurriculum(curriculumData);
        setAssignments(assignmentsData);
        setSessions(sessionsData);
        setSubmissions(submissionsData);
      } catch (error) {
        console.error('Failed to load student home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  // Determine current module based on progress or simple logic
  // For demo, just pick the module corresponding to week 2
  const currentModule = curriculum.find((c) => c.week === 2) || curriculum[0];

  // Find next upcoming session
  const now = new Date();
  const nextSession = (Array.isArray(sessions) ? sessions : [])
    .filter((s) => new Date(s.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const nextSessionDate = nextSession ? new Date(nextSession.date) : null;

  // Get upcoming assignments (not submitted, sorted by due date)
  const upcomingAssignments = (Array.isArray(assignments) ? assignments : [])
    .filter((a) => {
      // Check both profile submissions and fetched submissions
      const hasSubmission =
        profile?.submissions?.some((s) => s.assignmentId === a.id) ||
        submissions.some((s) => s.assignmentId === a.id);
      return !hasSubmission; // Only show pending assignments
    })
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 2);

  // Get next lessons (just showing topics from current module for now)
  const nextLessons =
    currentModule?.topics?.slice(0, 3)?.map((topic, i) => ({
      id: i,
      title: topic,
      duration: currentModule?.durationMinutes
        ? `${Math.round(
            currentModule.durationMinutes / (currentModule.topics?.length || 1)
          )} mins`
        : 'TBD',
      type: 'Video', // Default to Video if type not available in schema
    })) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-10 -mb-10 blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-brand-100 max-w-xl mb-8">
            You're making great progress. You've completed{' '}
            {profile?.progress || 0}% of the{' '}
            {profile?.cohort?.name || 'Digital Sales Assistant'} program. Keep
            it up!
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/student/curriculum"
              className="bg-white text-brand-700 px-6 py-3 rounded-xl font-bold hover:bg-brand-50 transition-colors inline-flex items-center shadow-lg"
            >
              Continue Learning
              <PlayCircle className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/student/assignments"
              className="bg-brand-700/50 text-white border border-brand-500 px-6 py-3 rounded-xl font-medium hover:bg-brand-700 transition-colors inline-flex items-center"
            >
              View Assignments
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Current Module
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {currentModule?.title || 'Fundamentals'}
          </h3>
          <p className="text-gray-500 text-sm">
            Week {currentModule?.week || 1} of {curriculum.length}
          </p>
          <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-brand-500 h-1.5 rounded-full w-[60%]"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Next Session
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {nextSessionDate
              ? formatDate(nextSessionDate.toISOString())
                  .split(',')
                  .slice(0, 2)
                  .join(',')
              : 'No upcoming sessions'}
          </h3>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />{' '}
            {nextSession
              ? `${formatDate(nextSession.startTime)
                  .split(' ')
                  .pop()} - ${formatDate(nextSession.endTime).split(' ').pop()}`
              : 'Check back later'}
          </p>
          <button
            type="button"
            className="mt-4 text-purple-600 text-sm font-semibold hover:text-purple-700"
          >
            Add to Calendar
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Overall Progress
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {profile?.progress || 0}%
          </h3>
          <p className="text-gray-500 text-sm">Keep going!</p>
          <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${profile?.progress || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Recent Activity / Next Up */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Up Next</h2>
            <Link
              to="/student/curriculum"
              className="text-brand-600 text-sm font-semibold hover:text-brand-700"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {nextLessons.map((lesson, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-sm group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  0{i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {lesson.title}
                  </h4>
                  <p className="text-gray-500 text-xs">
                    {lesson.type} • {lesson.duration}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-brand-200 group-hover:text-brand-600">
                  <PlayCircle className="w-4 h-4" />
                </div>
              </div>
            ))}
            {nextLessons.length === 0 && (
              <p className="text-gray-500 text-center">
                No upcoming lessons found.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Upcoming Assignments
            </h2>
            <Link
              to="/student/assignments"
              className="text-brand-600 text-sm font-semibold hover:text-brand-700"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 rounded-xl bg-orange-50 border border-orange-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">
                    Due {formatDate(assignment.dueAt)}
                  </span>
                  <Clock className="w-4 h-4 text-orange-400" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">
                  {assignment.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {assignment.description}
                </p>
                <button
                  type="button"
                  className="text-sm font-semibold text-orange-700 hover:text-orange-800 flex items-center gap-1"
                >
                  Submit Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
            {upcomingAssignments.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No upcoming assignments! 🎉
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
