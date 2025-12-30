import { useEffect, useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { api } from '../services/api';
import type { Assignment, StudentProfile, Submission } from '../types/schema';
import { formatDate } from '../utils/date';
import { useToast } from '../context/ToastContext';

export function Assignments() {
  const { addToast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingFor, setSubmittingFor] = useState<Assignment | null>(null);
  const [contentURL, setContentURL] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileRef, setFileRef] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsData, profileData, submissionsData] = await Promise.all([
          api.assignments.list(),
          api.getCurrentUserProfile(),
          api.assignments.getSubmissions().catch(() => []),
        ]);
        setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
        setProfile(profileData);
        // Merge profile submissions with fetched submissions if needed
        // Ideally api.getSubmissions() returns all submissions for the student
        if (profileData && Array.isArray(submissionsData) && submissionsData.length > 0) {
           setProfile(prev => prev ? ({ ...prev, submissions: submissionsData }) : prev);
        }
      } catch (error) {
        console.error('Failed to fetch assignments data:', error);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSubmission = (assignmentId: string) => {
    return profile?.submissions?.find((s) => s.assignmentId === assignmentId);
  };

  const openSubmit = (assignment: Assignment) => {
    setSubmittingFor(assignment);
    setContentURL('');
    setFile(null);
    setFileRef('');
    setUploadStatus('');
  };

  const submitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingFor) return;
    if (!fileRef && !contentURL) {
      addToast('Provide a content URL or upload a file', 'error');
      return;
    }
    try {
      setSubmitLoading(true);
      const res = await api.assignments.createSubmission(submittingFor.id, {
        ...(contentURL ? { contentURL } : {}),
        ...(fileRef ? { fileRef } : {}),
      });
      const created = res as Submission | undefined;
      if (profile) {
        const newSubmission: Submission = {
          id: created?.id ?? `${submittingFor.id}-${Date.now()}`,
          assignmentId: submittingFor.id,
          studentId: profile.id,
          contentURL: contentURL || undefined,
          fileRef: fileRef || undefined,
          status: 'PENDING',
          score: null,
          feedback: null,
          submittedAt: new Date().toISOString(),
        };
        const current: Submission[] = Array.isArray(profile.submissions)
          ? profile.submissions
          : [];
        const merged: Submission[] = [
          ...current.filter((s) => s.assignmentId !== submittingFor.id),
          newSubmission,
        ];
        setProfile({ ...profile, submissions: merged });
      }
      setSubmittingFor(null);
      addToast('Assignment submitted successfully', 'success');
    } catch {
      addToast('Failed to submit assignment', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setUploadStatus('');
  };
  const uploadSelectedFile = async () => {
    if (!file) {
      setUploadStatus('No file selected.');
      return;
    }
    try {
      setUploadStatus('Requesting upload URL...');
      const resp = (await api.files.upload({
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
      })) as { fileRef: string; url: string };
      if (!resp || !resp.url || !resp.fileRef) {
        setUploadStatus('');
        addToast('Failed to get upload URL', 'error');
        return;
      }
      setUploadStatus('Uploading...');
      const putRes = await fetch(resp.url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      });
      if (!putRes.ok) {
        setUploadStatus('');
        addToast('Upload failed', 'error');
        return;
      }
      setFileRef(resp.fileRef);
      setUploadStatus('Uploaded. Ready to submit.');
      addToast('File uploaded successfully', 'success');
    } catch {
      setUploadStatus('');
      addToast('Upload error', 'error');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading assignments...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Assignments</h1>

      <div className="grid gap-4">
        {assignments.map((assignment) => {
          const submission = getSubmission(assignment.id);
          const isSubmitted = !!submission;

          return (
            <div
              key={assignment.id}
              className="bg-white p-6 rounded-lg border shadow-sm flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {assignment.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Due: {formatDate(assignment.dueAt)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {isSubmitted ? (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>Submitted</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Pending</span>
                  </div>
                )}

                <button
                  type="button"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => (isSubmitted ? null : openSubmit(assignment))}
                >
                  {isSubmitted ? 'View Feedback' : 'Submit'}
                </button>
              </div>
            </div>
          );
        })}
        {assignments.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No assignments found.
          </p>
        )}
      </div>
      {submittingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Submit Assignment
              </h2>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSubmittingFor(null)}
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={submitAssignment} className="px-6 py-5 space-y-4">
              <div className="space-y-1">
                <label htmlFor="content-url" className="text-sm text-gray-700">
                  Content URL
                </label>
                <input
                  id="content-url"
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="https://files.example.com/submission.pdf"
                  value={contentURL}
                  onChange={(e) => setContentURL(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="file-input" className="text-sm text-gray-700">
                  Or Upload File
                </label>
                <input
                  id="file-input"
                  type="file"
                  className="w-full"
                  onChange={handleFileSelect}
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={uploadSelectedFile}
                    disabled={!file || submitLoading}
                    aria-label="Upload selected file"
                  >
                    Upload
                  </button>
                  <span className="text-xs text-gray-500">{uploadStatus}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setSubmittingFor(null)}
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
