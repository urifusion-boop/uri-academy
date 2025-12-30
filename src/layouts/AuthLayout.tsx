import { Link, Outlet } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-5/12">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <Link to="/" className="flex items-center gap-2 group mb-8">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-200">
                U
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                Uri<span className="text-brand-600">Academy</span>
              </span>
            </Link>
          </div>

          <Outlet />
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
