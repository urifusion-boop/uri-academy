import { UploadCloud } from 'lucide-react';

export function Capstone() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Capstone Project</h1>

      <div className="bg-white p-8 rounded-xl border shadow-sm mb-8">
        <div className="inline-block px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-bold mb-4">
          Final Requirement
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Comprehensive Sales Strategy Plan
        </h2>
        <p className="text-gray-600 mb-6">
          For your final project, you will develop a complete sales strategy for
          a hypothetical or real product. This will include persona definition,
          outreach sequences, objection handling scripts, and a mock CRM setup.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="font-bold text-gray-900 mb-4">
            Project Requirements:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Product Description & Value Proposition (PDF)</li>
            <li>3 Ideal Customer Profiles (ICPs)</li>
            <li>5-Step Email Sequence</li>
            <li>Mock Call Script</li>
            <li>Video Presentation (5 mins)</li>
          </ul>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-brand-500 hover:bg-brand-50 transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload your submission
          </h3>
          <p className="text-gray-500 text-sm">
            Drag and drop your files here, or click to browse
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Supported formats: PDF, DOCX, ZIP (Max 50MB)
          </p>
        </div>
      </div>
    </div>
  );
}
