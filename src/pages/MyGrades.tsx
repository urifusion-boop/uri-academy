import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { api } from '../services/api';
import type { StudentProfile, Assignment, Submission } from '../types/schema';
import { useToast } from '../context/ToastContext';

export function MyGrades() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch profile, assignments, and submissions in parallel
        const [userProfile, assignmentsList, submissionsList] =
          await Promise.all([
            api.getCurrentUserProfile(),
            api.assignments.list(),
            api.getSubmissions(),
          ]);

        setProfile(userProfile);
        setAssignments(Array.isArray(assignmentsList) ? assignmentsList : []);
        setSubmissions(Array.isArray(submissionsList) ? submissionsList : []);
      } catch (err) {
        console.error('Failed to fetch grades data:', err);
        addToast('Failed to load grades', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  // Errors are surfaced via toasts; continue rendering with available data

  // Map assignments to include submission status/score
  const processedGrades = assignments.map((assignment) => {
    const submission =
      submissions.find((s) => s.assignmentId === assignment.id) ||
      profile?.submissions?.find((s) => s.assignmentId === assignment.id);

    return {
      id: assignment.id,
      name: assignment.title,
      score: submission?.score ?? null,
      total: assignment.maxScore,
      status: submission
        ? submission.score !== null
          ? 'Graded'
          : 'Submitted'
        : 'Pending',
      date: submission?.submittedAt || assignment.dueAt,
      feedback: submission?.feedback,
      dueDate: assignment.dueAt,
    };
  });

  const calculateAverage = () => {
    let totalScore = 0;
    let count = 0;
    processedGrades.forEach((item) => {
      if (item.score !== null) {
        // Normalize to percentage
        const percentage = (item.score / item.total) * 100;
        totalScore += percentage;
        count++;
      }
    });
    return count > 0 ? Math.round(totalScore / count) : 0;
  };

  const averageScore = calculateAverage();
  const gradedCount = processedGrades.filter(
    (g) => g.status === 'Graded'
  ).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
          <p className="text-gray-600 mt-1">
            Track your academic performance and progress.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {averageScore}%
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">
                {gradedCount}/{assignments.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grades List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Assignment
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Feedback
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedGrades.length > 0 ? (
                processedGrades.map((grade) => (
                  <tr
                    key={grade.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {grade.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Max Score: {grade.total}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          grade.status === 'Graded'
                            ? 'bg-green-100 text-green-800'
                            : grade.status === 'Submitted'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {grade.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {grade.score !== null ? (
                        <div className="text-sm text-gray-900 font-bold">
                          {grade.score}{' '}
                          <span className="text-gray-400 font-normal">
                            / {grade.total}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grade.date
                        ? new Date(grade.date).toLocaleDateString()
                        : 'No date'}
                    </td>
                    <td className="px-6 py-4">
                      {grade.feedback ? (
                        <p
                          className="text-sm text-gray-600 max-w-xs truncate"
                          title={grade.feedback}
                        >
                          {grade.feedback}
                        </p>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          No feedback
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
