import { useEffect, useRef, useState } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import type { Assignment, StudentProfile, Submission } from '../types/schema';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/date';

export function Capstone() {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [capstone, setCapstone] = useState<Assignment | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [contentURL, setContentURL] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileRef, setFileRef] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [assignments, prof, submissions] = await Promise.all([
          api.assignments.list(),
          api.getCurrentUserProfile(),
          api.assignments.getSubmissions().catch(() => []),
        ]);
        const list = Array.isArray(assignments) ? assignments : [];
        const found =
          list.find(
            (a) => a.title?.toLowerCase().includes('capstone') || false
          ) || null;
        setCapstone(found);
        setProfile(prof);
        const subs = Array.isArray(submissions) ? submissions : [];
        const existing =
          found && subs.find((s) => s.assignmentId === found.id)
            ? (subs.find((s) => s.assignmentId === found.id) as Submission)
            : prof?.submissions?.find((s) => s.assignmentId === found?.id);
        setSubmission(existing || null);
      } catch (e) {
        console.error('Failed to load capstone data', e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const uploadFile = async (fileToUpload: File): Promise<string | null> => {
    try {
      setUploadStatus('Requesting upload URL...');
      const resp = (await api.files.upload({
        fileName: fileToUpload.name,
        contentType: fileToUpload.type || 'application/octet-stream',
      })) as { fileRef: string; url: string };
      if (!resp || !resp.fileRef) {
        setUploadStatus('');
        addToast('Failed to get upload URL', 'error');
        return null;
      }
      setUploadStatus('Uploading...');
      if (resp.url) {
        const putRes = await fetch(resp.url, {
          method: 'PUT',
          headers: {
            'Content-Type': fileToUpload.type || 'application/octet-stream',
          },
          body: fileToUpload,
        });
        if (!putRes.ok) {
          setUploadStatus('');
          addToast('Upload failed', 'error');
          return null;
        }
      }
      setFileRef(resp.fileRef);
      setUploadStatus('Uploaded. Ready to submit.');
      return resp.fileRef;
    } catch {
      setUploadStatus('');
      addToast('Upload error', 'error');
      return null;
    }
  };

  const uploadSelectedFile = async () => {
    if (!file) {
      fileInputRef.current?.click();
      return;
    }
    await uploadFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setFileRef('');
    setUploadStatus('');
  };

  const submitCapstone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!capstone) {
      addToast('Capstone assignment not available yet', 'error');
      return;
    }
    let currentFileRef = fileRef;
    if (!currentFileRef && file) {
      setSubmitLoading(true);
      const uploadedRef = await uploadFile(file);
      if (!uploadedRef) {
        setSubmitLoading(false);
        return;
      }
      currentFileRef = uploadedRef;
    }
    if (!currentFileRef && !contentURL) {
      addToast('Provide a content URL or upload a file', 'error');
      return;
    }
    try {
      setSubmitLoading(true);
      const res = await api.assignments.createSubmission(capstone.id, {
        ...(contentURL ? { contentURL } : {}),
        ...(currentFileRef ? { fileRef: currentFileRef } : {}),
      });
      const created = res as Submission | undefined;
      const newSub: Submission = {
        id: created?.id ?? `${capstone.id}-${Date.now()}`,
        assignmentId: capstone.id,
        studentId: profile?.id || '',
        contentURL: contentURL || undefined,
        fileRef: currentFileRef || undefined,
        status: 'PENDING',
        score: null,
        feedback: null,
        submittedAt: new Date().toISOString(),
      };
      setSubmission(newSub);
      addToast('Capstone submitted successfully', 'success');
      setContentURL('');
      setFile(null);
      setFileRef('');
      setUploadStatus('');
    } catch {
      addToast('Failed to submit capstone', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Capstone Project</h1>

      <div className="bg-white p-8 rounded-xl border shadow-sm mb-8">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : !capstone ? (
          <div className="p-6 text-center text-gray-500">
            Capstone assignment not available yet. Please check back later.
          </div>
        ) : (
          <>
            <div className="inline-block px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-bold mb-4">
              Final Requirement
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {capstone.title}
            </h2>
            <p className="text-gray-600 mb-6 whitespace-pre-wrap">
              {capstone.description}
            </p>

            {submission ? (
              <div className="p-6 rounded-lg border bg-green-50 flex items-center justify-between">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Capstone Submitted</p>
                    <p className="text-sm">
                      {formatDate(submission.submittedAt)}
                      {typeof submission.score === 'number'
                        ? ` • Score: ${submission.score}${
                            submission.feedback
                              ? ` • ${submission.feedback}`
                              : ''
                          }`
                        : ' • Awaiting grading'}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  {typeof submission.score === 'number'
                    ? 'Graded'
                    : 'Submitted'}
                </span>
              </div>
            ) : (
              <div className="border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Upload your submission
                    </h3>
                    <p className="text-sm text-gray-600">
                      Provide a link to your project or upload a file
                    </p>
                  </div>
                </div>
                <form onSubmit={submitCapstone} className="space-y-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="capstone-url"
                      className="text-sm text-gray-700"
                    >
                      Content URL
                    </label>
                    <input
                      id="capstone-url"
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="https://repo.example.com/your-capstone"
                      value={contentURL}
                      onChange={(e) => setContentURL(e.target.value)}
                      required={!fileRef && !file}
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="capstone-file"
                      className="text-sm text-gray-700"
                    >
                      Or Upload File
                    </label>
                    <input
                      id="capstone-file"
                      ref={fileInputRef}
                      type="file"
                      className="w-full hidden"
                      onChange={handleFileSelect}
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2">
                        <button
                          type="button"
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                          onClick={uploadSelectedFile}
                          disabled={submitLoading}
                          aria-label={
                            file ? 'Upload selected file' : 'Choose file'
                          }
                        >
                          {file ? 'Upload' : 'Choose File'}
                        </button>
                        {file && (
                          <span className="text-sm text-gray-600 truncate">
                            {file.name}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {uploadStatus}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
                      disabled={submitLoading}
                    >
                      {submitLoading ? 'Submitting...' : 'Submit Capstone'}
                    </button>
                  </div>
                </form>
                <p className="text-xs text-gray-400 mt-2">
                  Supported formats: PDF, DOCX, ZIP (Max 50MB)
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
