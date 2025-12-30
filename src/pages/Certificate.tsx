import { useEffect, useState } from 'react';
import { Lock, Award, Download } from 'lucide-react';
import { api } from '../services/api';
import type { Certificate, StudentProfile } from '../types/schema';
import { formatDate } from '../utils/date';

export function Certificate() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await api.getCurrentUserProfile();
        setProfile(profileData);

        if (profileData?.id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any = await api.certificates.list({
            studentId: profileData.id,
          });
          const items = Array.isArray(data)
            ? data
            : data && Array.isArray(data.items)
            ? data.items
            : [];
          setCertificates(items);
        }
      } catch (err) {
        console.error('Failed to fetch certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading certificate data...</div>;
  }

  // If user has certificates, show them
  if (certificates.length > 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Certificates</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white p-8 rounded-xl border shadow-sm text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Certificate Issued
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                Serial: {cert.serialNumber}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Issued: {formatDate(cert.issuedAt)}
              </p>
              <a
                href={cert.fileURL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback: Show progress toward certificate
  const completedAssignments =
    profile?.submissions?.filter((s) => s.score !== null).length || 0;
  // Hardcoded total for now as we don't have assignment count handy without fetching all assignments
  // But we can approximate or just show count
  const assignmentProgress = Math.min((completedAssignments / 8) * 100, 100); // Assume 8 assignments

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Certificate</h1>

      <div className="bg-white p-12 rounded-xl border shadow-sm text-center">
        <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Certificate Locked
        </h2>
        <p className="text-gray-600 max-w-lg mx-auto mb-8">
          You must complete all assignments and the capstone project to unlock
          your certificate.
        </p>

        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Assignments Graded</span>
            <span className="font-bold text-gray-900">
              {completedAssignments} / 8
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full"
              style={{ width: `${assignmentProgress}%` }}
            ></div>
          </div>

          {/* Placeholder for attendance progress */}
          <div className="flex items-center justify-between text-sm pt-2">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-bold text-gray-900">
              {profile?.progress || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full"
              style={{ width: `${profile?.progress || 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
