import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, FileText, Link as LinkIcon } from 'lucide-react';
import { api } from '../services/api';
import type { Submission } from '../types/schema';
import { formatDate } from '../utils/date';
import { useToast } from '../context/ToastContext';

export function AdminSubmissions() {
  const { addToast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(
    null
  );
  const [gradeScore, setGradeScore] = useState<number | ''>('');
  const [gradeFeedback, setGradeFeedback] = useState<string>('');
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // Use the admin-specific endpoint to get ALL submissions
        const data = await api.assignments.getAllSubmissions();
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const handleView = async (submission: Submission) => {
    if (submission.contentURL) {
      window.open(submission.contentURL, '_blank');
      return;
    }

    if (submission.fileRef) {
      // Open window immediately to avoid popup blockers
      const newWindow = window.open('', '_blank');

      if (!newWindow) {
        addToast('Popup blocked. Please allow popups for this site.', 'error');
        return;
      }

      newWindow.document.write(
        '<html><body style="font-family: sans-serif; padding: 20px;"><p>Loading file...</p></body></html>'
      );
      newWindow.document.close();

      try {
        const url = await api.files.getDownloadUrl(submission.fileRef);
        if (url) {
          newWindow.location.href = url;
        } else {
          newWindow.close();
          addToast('Could not get download URL', 'error');
        }
      } catch (error) {
        newWindow.close();
        console.error('Failed to get download URL:', error);
        addToast('Failed to open file', 'error');
      }
      return;
    }

    addToast('No content to view', 'info');
  };

  const openApprove = (submission: Submission) => {
    setGradingSubmission(submission);
    setGradeScore('');
    setGradeFeedback('');
  };

  const submitApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    if (gradeScore === '' || typeof gradeScore !== 'number') {
      addToast('Please enter a valid score', 'error');
      return;
    }
    try {
      setGrading(true);
      await api.assignments.grade(gradingSubmission.assignmentId, {
        studentId: gradingSubmission.studentId,
        score: gradeScore,
        feedback: gradeFeedback || undefined,
      });
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === gradingSubmission.id
            ? { ...s, score: gradeScore, feedback: gradeFeedback }
            : s
        )
      );
      setGradingSubmission(null);
      addToast('Submission graded successfully', 'success');
    } catch (err) {
      console.error('Approve (grade) failed:', err);
      addToast('Failed to approve/grade submission', 'error');
    } finally {
      setGrading(false);
    }
  };

  const handleReject = async (submission: Submission) => {
    const notes = window.prompt('Enter reject reason/notes:');
    if (notes === null) return;
    try {
      await api.assignments.updateSubmission(submission.id, {
        notes: `Rejected: ${notes}`,
      });
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submission.id ? { ...s, notes: `Rejected: ${notes}` } : s
        )
      );
      addToast('Submission rejected successfully', 'success');
    } catch (err) {
      console.error('Reject failed:', err);
      addToast('Failed to reject submission', 'error');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading submissions...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pending Submissions</h1>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-white p-6 rounded-lg border shadow-sm flex items-center justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold">
                {submission.student?.user?.initials ||
                  (submission.student?.user?.name
                    ? submission.student.user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'ST')}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {submission.assignment?.title || 'Unknown Assignment'}
                </h3>
                <p className="text-sm text-gray-500">
                  Submitted by{' '}
                  {submission.student?.user?.name || 'Unknown Student'} •{' '}
                  {formatDate(submission.submittedAt)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {submission.notes || 'No additional notes provided.'}
                </p>
                {typeof submission.score === 'number' && (
                  <p className="text-sm text-green-600 mt-1">
                    Score: {submission.score}{' '}
                    {submission.feedback ? (
                      <span className="text-gray-500">
                        • {submission.feedback}
                      </span>
                    ) : null}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                title={submission.fileRef ? 'View File' : 'View Link'}
                aria-label="View submission"
                onClick={() => handleView(submission)}
                disabled={!submission.contentURL && !submission.fileRef}
              >
                {submission.fileRef ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <LinkIcon className="w-5 h-5" />
                )}
              </button>
              <button
                type="button"
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Approve"
                aria-label="Approve submission"
                onClick={() => openApprove(submission)}
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Reject"
                aria-label="Reject submission"
                onClick={() => handleReject(submission)}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {submissions.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No pending submissions found.
          </p>
        )}
      </div>

      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Approve & Grade
              </h2>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setGradingSubmission(null)}
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={submitApprove} className="px-6 py-5 space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="grade-score"
                  className="text-sm font-medium text-gray-700"
                >
                  Score (0-100)
                </label>
                <input
                  id="grade-score"
                  type="number"
                  min={0}
                  max={gradingSubmission.assignment?.maxScore ?? 100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={gradeScore}
                  onChange={(e) => {
                    const v = e.target.value;
                    setGradeScore(v === '' ? '' : Number(v));
                  }}
                  required
                />
                <p className="text-xs text-gray-500">
                  Max {gradingSubmission.assignment?.maxScore ?? 100}
                </p>
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="grade-feedback"
                  className="text-sm text-gray-700"
                >
                  Feedback (optional)
                </label>
                <textarea
                  id="grade-feedback"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setGradingSubmission(null)}
                  disabled={grading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  disabled={grading}
                >
                  {grading ? 'Saving...' : 'Approve & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
