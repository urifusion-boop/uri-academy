'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 relative flex flex-col px-4 sm:px-10 lg:flex-none lg:w-1/2 xl:w-5/12 overflow-y-auto">
        {/* Back to home — pinned top-left */}
        <div className="absolute top-6 left-6 sm:left-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm lg:w-96 flex-1 flex flex-col justify-center">
          <div className="mb-6">
            <Link href="/">
              <Image
                src="/assets/image.png"
                alt="Uri Academy"
                width={180}
                height={180}
                className="h-28 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {children}
        </div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:block relative w-0 flex-1 bg-brand-900">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-900 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white z-10">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Accelerate your sales career with AI-powered skills.
            </h2>
            <div className="space-y-4">
              {[
                'Access exclusive course materials',
                'Track your weekly progress',
                'Submit assignments and get feedback',
                'Connect with your cohort',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-500/30 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-brand-200" />
                  </div>
                  <span className="text-brand-100 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
      </div>
    </div>
  );
}
